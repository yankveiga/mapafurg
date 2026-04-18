/**
 * Servidor WebSocket de localizacao do projeto Mapa FURG.
 *
 * Responsabilidades deste modulo:
 * 1) Receber mensagens de rastreamento no formato `bus_location`.
 * 2) Validar autenticacao, origem e consistencia dos dados.
 * 3) Manter o ultimo estado por onibus em memoria.
 * 4) Repassar atualizacoes em tempo real para todos os clientes conectados.
 */
import http from 'node:http';
import process from 'node:process';
import { WebSocketServer, WebSocket } from 'ws';

// Parametros principais de execucao (porta/host/identidade).
const PORT = Number(process.env.PORT ?? process.env.WS_PORT ?? 8080);
const HOST = process.env.WS_HOST ?? '0.0.0.0';
const BUS_ID_PADRAO = process.env.BUS_ID ?? 'interno';

// Token obrigatorio para publicacao de coordenadas no servidor.
const AUTH_TOKEN = process.env.WS_AUTH_TOKEN?.trim();

// Opcao de atribuir automaticamente IDs de onibus por conexao (bus-1, bus-2...).
const BUS_ID_PREFIX = process.env.BUS_ID_PREFIX ?? 'bus';
const AUTO_ASSIGN_BUS_ID = (process.env.AUTO_ASSIGN_BUS_ID ?? 'true').toLowerCase() !== 'false';

// Lista de origens permitidas para conexoes de navegador.
const ALLOWED_ORIGINS = (process.env.WS_ALLOWED_ORIGINS ?? '')
  .split(',')
  .map((item) => item.trim())
  .filter(Boolean);
const ENFORCE_ORIGIN = (process.env.WS_ENFORCE_ORIGIN ?? 'true').toLowerCase() !== 'false';
const RATE_LIMIT_WINDOW_MS = Number(process.env.WS_RATE_LIMIT_WINDOW_MS ?? 60_000);
const RATE_LIMIT_MAX_MSG_PER_SOCKET = Number(process.env.WS_RATE_LIMIT_MAX_MSG_PER_SOCKET ?? 120);
const RATE_LIMIT_MAX_MSG_PER_IP = Number(process.env.WS_RATE_LIMIT_MAX_MSG_PER_IP ?? 600);

// Fail-fast: evita subir o servico sem autenticacao habilitada.
if (!AUTH_TOKEN) {
  console.error('[fatal] WS_AUTH_TOKEN ausente. Defina um token antes de iniciar o servidor.');
  process.exit(1);
}

if (!Number.isFinite(RATE_LIMIT_WINDOW_MS) || RATE_LIMIT_WINDOW_MS <= 0) {
  console.error('[fatal] WS_RATE_LIMIT_WINDOW_MS invalido.');
  process.exit(1);
}

if (!Number.isFinite(RATE_LIMIT_MAX_MSG_PER_SOCKET) || RATE_LIMIT_MAX_MSG_PER_SOCKET <= 0) {
  console.error('[fatal] WS_RATE_LIMIT_MAX_MSG_PER_SOCKET invalido.');
  process.exit(1);
}

if (!Number.isFinite(RATE_LIMIT_MAX_MSG_PER_IP) || RATE_LIMIT_MAX_MSG_PER_IP <= 0) {
  console.error('[fatal] WS_RATE_LIMIT_MAX_MSG_PER_IP invalido.');
  process.exit(1);
}

const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    // Endpoint de saude para monitoracao e verificacao de deploy.
    res.writeHead(200, { 'content-type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({
      ok: true,
      service: 'bus-ws',
      autoAssignBusId: AUTO_ASSIGN_BUS_ID,
      activeConnections: wss.clients.size,
      activeBuses: ultimasLocalizacoesPorBusId.size,
      time: new Date().toISOString(),
    }));
    return;
  }

  res.writeHead(200, { 'content-type': 'text/plain; charset=utf-8' });
  res.end('Bus location WebSocket server online.');
});

const wss = new WebSocketServer({ server });

// Estado em memoria (sem persistencia em banco): ultimo ponto por onibus.
const ultimasLocalizacoesPorBusId = new Map();

// Metadados de cada conexao e controle de limites por IP.
const metaPorConexao = new WeakMap();
const slotsEmUso = new Set();
const limitePorIp = new Map();

// Reserva o menor slot livre para manter IDs previsiveis.
const alocarSlot = () => {
  let slot = 1;
  while (slotsEmUso.has(slot)) {
    slot += 1;
  }
  slotsEmUso.add(slot);
  return slot;
};

const liberarSlot = (slot) => {
  if (Number.isInteger(slot)) {
    slotsEmUso.delete(slot);
  }
};

// Implementa janela de rate limit para socket/IP.
const permitirMensagemPorLimite = (estadoAtual, limite, agoraMs) => {
  const estado = estadoAtual ?? { inicioJanelaMs: agoraMs, contador: 0 };

  if (agoraMs - estado.inicioJanelaMs >= RATE_LIMIT_WINDOW_MS) {
    estado.inicioJanelaMs = agoraMs;
    estado.contador = 0;
  }

  estado.contador += 1;
  return {
    estado,
    permitido: estado.contador <= limite,
  };
};

const origemPermitida = (originHeader) => {
  if (!ENFORCE_ORIGIN) return true;
  if (!originHeader) return true; // Apps nativos normalmente nao enviam Origin.
  return ALLOWED_ORIGINS.includes(originHeader);
};

// Envio seguro de JSON para conexoes abertas.
const enviarJson = (cliente, payload) => {
  if (cliente.readyState === WebSocket.OPEN) {
    cliente.send(JSON.stringify(payload));
  }
};

const validarMensagemLocalizacao = (payload) => {
  if (!payload || typeof payload !== 'object') return false;
  if (payload.type !== 'bus_location') return false;
  if (payload.token !== AUTH_TOKEN) return false;
  if (typeof payload.lat !== 'number' || typeof payload.lng !== 'number') return false;
  if (!Number.isFinite(payload.lat) || !Number.isFinite(payload.lng)) return false;
  if (payload.lat < -90 || payload.lat > 90 || payload.lng < -180 || payload.lng > 180) return false;
  return true;
};

// Normaliza o payload para o contrato unico consumido pelo frontend.
const normalizarMensagemLocalizacao = (payload, busIdConexao) => ({
  type: 'bus_location',
  busId: AUTO_ASSIGN_BUS_ID
    ? busIdConexao
    : (typeof payload.busId === 'string' && payload.busId.trim() ? payload.busId : BUS_ID_PADRAO),
  lat: payload.lat,
  lng: payload.lng,
  heading: Number.isFinite(payload.heading) ? payload.heading : null,
  speed: Number.isFinite(payload.speed) ? payload.speed : null,
  accuracy: Number.isFinite(payload.accuracy) ? payload.accuracy : null,
  timestamp: typeof payload.timestamp === 'string' ? payload.timestamp : new Date().toISOString(),
  serverReceivedAt: new Date().toISOString(),
});

const broadcast = (payload) => {
  for (const cliente of wss.clients) {
    enviarJson(cliente, payload);
  }
};

wss.on('connection', (ws, req) => {
  // 1) Filtro de origem no handshake.
  const originHeader = typeof req.headers.origin === 'string' ? req.headers.origin : '';
  if (!origemPermitida(originHeader)) {
    ws.close(1008, 'Origin nao permitido');
    return;
  }

  const ipCliente = req.socket.remoteAddress ?? 'desconhecido';

  // 2) Determina identidade da conexao atual.
  let busIdConexao = BUS_ID_PADRAO;
  let slotConexao = null;
  if (AUTO_ASSIGN_BUS_ID) {
    slotConexao = alocarSlot();
    busIdConexao = `${BUS_ID_PREFIX}-${slotConexao}`;
  }
  metaPorConexao.set(ws, {
    busId: busIdConexao,
    slot: slotConexao,
    ip: ipCliente,
    limiteSocket: { inicioJanelaMs: Date.now(), contador: 0 },
  });

  console.log(`[ws] cliente conectado: ${ipCliente} -> ${busIdConexao}`);

  // Mensagem inicial para facilitar debug dos clientes.
  enviarJson(ws, {
    type: 'hello',
    message: 'Conectado ao servidor de localizacao',
    assignedBusId: busIdConexao,
    autoAssignBusId: AUTO_ASSIGN_BUS_ID,
    expectedFormat: {
      type: 'bus_location',
      busId: AUTO_ASSIGN_BUS_ID ? '(ignorado; servidor atribui automaticamente)' : BUS_ID_PADRAO,
      lat: -32.0754,
      lng: -52.1536,
      timestamp: new Date().toISOString(),
    },
  });

  for (const localizacao of ultimasLocalizacoesPorBusId.values()) {
    enviarJson(ws, localizacao);
  }

  ws.on('message', (raw) => {
    try {
      const payload = JSON.parse(raw.toString());

      // 3) Valida formato e token antes de processar.
      if (!validarMensagemLocalizacao(payload)) {
        enviarJson(ws, { type: 'error', message: 'Formato invalido para bus_location.' });
        return;
      }

      const meta = metaPorConexao.get(ws);
      const agoraMs = Date.now();

      // 4) Limite por conexao.
      const limiteSocket = permitirMensagemPorLimite(
        meta?.limiteSocket,
        RATE_LIMIT_MAX_MSG_PER_SOCKET,
        agoraMs
      );
      if (meta) {
        meta.limiteSocket = limiteSocket.estado;
        metaPorConexao.set(ws, meta);
      }
      if (!limiteSocket.permitido) {
        enviarJson(ws, { type: 'error', message: 'Rate limit por conexao excedido.' });
        ws.close(1008, 'Rate limit por conexao excedido');
        return;
      }

      // 5) Limite agregado por IP.
      const chaveIp = meta?.ip ?? ipCliente;
      const estadoIpAtual = limitePorIp.get(chaveIp);
      const limiteIp = permitirMensagemPorLimite(
        estadoIpAtual,
        RATE_LIMIT_MAX_MSG_PER_IP,
        agoraMs
      );
      limitePorIp.set(chaveIp, limiteIp.estado);
      if (!limiteIp.permitido) {
        enviarJson(ws, { type: 'error', message: 'Rate limit por IP excedido.' });
        ws.close(1008, 'Rate limit por IP excedido');
        return;
      }

      // 6) Atualiza estado e notifica observadores.
      const mensagemNormalizada = normalizarMensagemLocalizacao(payload, meta?.busId ?? BUS_ID_PADRAO);
      ultimasLocalizacoesPorBusId.set(mensagemNormalizada.busId, mensagemNormalizada);
      broadcast(mensagemNormalizada);
    } catch {
      enviarJson(ws, { type: 'error', message: 'Mensagem nao eh JSON valido.' });
    }
  });

  ws.on('close', () => {
    const meta = metaPorConexao.get(ws);

    // Remove onibus desconectado para evitar marcador "fantasma" no mapa.
    if (AUTO_ASSIGN_BUS_ID && meta?.busId) {
      ultimasLocalizacoesPorBusId.delete(meta.busId);
      broadcast({
        type: 'bus_disconnected',
        busId: meta.busId,
        timestamp: new Date().toISOString(),
      });
    }
    liberarSlot(meta?.slot);
    metaPorConexao.delete(ws);
    console.log(`[ws] cliente desconectado: ${meta?.busId ?? 'desconhecido'}`);
  });
});

wss.on('error', (error) => {
  console.error('[ws] erro ao iniciar servidor:', error.message);
});

server.listen(PORT, HOST, () => {
  console.log(`[ws] servidor ouvindo em ws://${HOST}:${PORT}`);
  console.log(`[http] healthcheck em http://${HOST}:${PORT}/health`);
  console.log(`[ws] enforce origin: ${ENFORCE_ORIGIN ? 'on' : 'off'}`);
  if (ENFORCE_ORIGIN) {
    console.log(`[ws] allowed origins: ${ALLOWED_ORIGINS.length > 0 ? ALLOWED_ORIGINS.join(', ') : '(nenhum configurado; apenas clientes sem Origin)'}`);
  }
});

server.on('error', (error) => {
  console.error('[http] erro ao iniciar servidor:', error.message);
});

/**
 * Servidor WebSocket de localização em tempo real.
 *
 * Funções principais:
 * - Receber payloads `bus_location` enviados pelos apps móveis.
 * - Validar autenticação e formato dos dados.
 * - Manter último estado de cada ônibus em memória.
 * - Repassar atualizações para todos os clientes conectados no mapa.
 */
import http from 'node:http';
import fs from 'node:fs';
import process from 'node:process';
import { WebSocketServer, WebSocket } from 'ws';

const carregarEnvLocal = () => {
  if (!fs.existsSync('.env')) return;

  const linhas = fs.readFileSync('.env', 'utf8').split(/\r?\n/);
  for (const linha of linhas) {
    const limpa = linha.trim();
    if (!limpa || limpa.startsWith('#')) continue;

    const separador = limpa.indexOf('=');
    if (separador === -1) continue;

    const chave = limpa.slice(0, separador).trim();
    const valor = limpa.slice(separador + 1).trim().replace(/^["']|["']$/g, '');
    if (chave && process.env[chave] === undefined) {
      process.env[chave] = valor;
    }
  }
};

carregarEnvLocal();

// Configurações base por ambiente.
const PORT = Number(process.env.PORT ?? process.env.WS_PORT ?? 8080);
const HOST = process.env.WS_HOST ?? '0.0.0.0';
const BUS_ID_PADRAO = process.env.BUS_ID ?? 'interno';
const AUTH_TOKEN = process.env.WS_AUTH_TOKEN ?? '';
const BUS_ID_PREFIX = process.env.BUS_ID_PREFIX ?? 'bus';
const AUTO_ASSIGN_BUS_ID = (process.env.AUTO_ASSIGN_BUS_ID ?? 'true').toLowerCase() !== 'false';
const BUS_ID_REGEX = /^[a-zA-Z0-9_-]{1,40}$/;

// HTTP simples para healthcheck e identificação do serviço.
const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'content-type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({
      ok: true,
      service: 'bus-ws',
      autoAssignBusId: AUTO_ASSIGN_BUS_ID,
      acceptsExplicitBusId: true,
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
// Última localização válida por ônibus (sem persistência em banco).
const ultimasLocalizacoesPorBusId = new Map();
// Metadados de conexão por socket.
const metaPorConexao = new WeakMap();
// Controle de slots para IDs sequenciais bus-1, bus-2, ...
const slotsEmUso = new Set();

// Reserva o primeiro slot disponível.
const alocarSlot = () => {
  let slot = 1;
  while (slotsEmUso.has(slot)) {
    slot += 1;
  }
  slotsEmUso.add(slot);
  return slot;
};

// Libera slot de conexão encerrada.
const liberarSlot = (slot) => {
  if (Number.isInteger(slot)) {
    slotsEmUso.delete(slot);
  }
};

// Envia payload JSON apenas para clientes com conexão aberta.
const enviarJson = (cliente, payload) => {
  if (cliente.readyState === WebSocket.OPEN) {
    cliente.send(JSON.stringify(payload));
  }
};

const busIdValido = (busId) => (
  typeof busId === 'string'
  && BUS_ID_REGEX.test(busId.trim())
);

const busIdFoiInformado = (busId) => (
  typeof busId === 'string'
  && busId.trim().length > 0
);

const obterBusIdPayload = (payload) => (
  busIdValido(payload.busId) ? payload.busId.trim() : null
);

// Valida contrato mínimo de mensagem recebida.
const validarMensagemLocalizacao = (payload) => {
  if (!payload || typeof payload !== 'object') return false;
  if (payload.type !== 'bus_location') return false;
  if (AUTH_TOKEN && payload.token !== AUTH_TOKEN) return false;
  if (busIdFoiInformado(payload.busId) && !busIdValido(payload.busId)) return false;
  if (typeof payload.lat !== 'number' || typeof payload.lng !== 'number') return false;
  if (!Number.isFinite(payload.lat) || !Number.isFinite(payload.lng)) return false;
  if (payload.lat < -90 || payload.lat > 90 || payload.lng < -180 || payload.lng > 180) return false;
  return true;
};

// Padroniza payload para o formato consumido pelo frontend.
const normalizarMensagemLocalizacao = (payload, busIdConexao) => {
  const busIdPayload = obterBusIdPayload(payload);

  return {
    type: 'bus_location',
    busId: busIdPayload ?? (AUTO_ASSIGN_BUS_ID ? busIdConexao : BUS_ID_PADRAO),
    lat: payload.lat,
    lng: payload.lng,
    speed: Number.isFinite(payload.speed) && payload.speed >= 0 ? payload.speed : null,
    accuracy: Number.isFinite(payload.accuracy) && payload.accuracy >= 0 ? payload.accuracy : null,
    timestamp: Number.isFinite(Date.parse(payload.timestamp ?? ''))
      ? new Date(Date.parse(payload.timestamp)).toISOString()
      : new Date().toISOString(),
    serverReceivedAt: new Date().toISOString(),
  };
};

// Distribui atualização para todos os clientes conectados.
const broadcast = (payload) => {
  for (const cliente of wss.clients) {
    enviarJson(cliente, payload);
  }
};

wss.on('connection', (ws, req) => {
  // Define identidade da conexão atual.
  let busIdConexao = BUS_ID_PADRAO;
  let slotConexao = null;
  if (AUTO_ASSIGN_BUS_ID) {
    slotConexao = alocarSlot();
    busIdConexao = `${BUS_ID_PREFIX}-${slotConexao}`;
  }
  metaPorConexao.set(ws, { busId: busIdConexao, slot: slotConexao });

  console.log(`[ws] cliente conectado: ${req.socket.remoteAddress} -> ${busIdConexao}`);

  // Mensagem inicial para facilitar depuração de clientes.
  enviarJson(ws, {
    type: 'hello',
    message: 'Conectado ao servidor de localizacao',
    assignedBusId: busIdConexao,
    autoAssignBusId: AUTO_ASSIGN_BUS_ID,
    expectedFormat: {
      type: 'bus_location',
      busId: AUTO_ASSIGN_BUS_ID
        ? '(opcional; se ausente, servidor atribui automaticamente)'
        : BUS_ID_PADRAO,
      lat: -32.0754,
      lng: -52.1536,
      speed: 8.7,
      accuracy: 6.2,
      timestamp: new Date().toISOString(),
    },
  });

  // Ao conectar, entrega último estado conhecido para sincronizar o mapa.
  for (const localizacao of ultimasLocalizacoesPorBusId.values()) {
    enviarJson(ws, localizacao);
    if (localizacao.disconnectedAt) {
      enviarJson(ws, {
        type: 'bus_disconnected',
        busId: localizacao.busId,
        timestamp: localizacao.disconnectedAt,
      });
    }
  }

  ws.on('message', (raw) => {
    try {
      const payload = JSON.parse(raw.toString());

      // Mensagens inválidas são rejeitadas explicitamente.
      if (!validarMensagemLocalizacao(payload)) {
        enviarJson(ws, { type: 'error', message: 'Formato invalido para bus_location.' });
        return;
      }

      // Atualiza memória e retransmite para observadores.
      const meta = metaPorConexao.get(ws);
      const mensagemNormalizada = normalizarMensagemLocalizacao(payload, meta?.busId ?? BUS_ID_PADRAO);
      const localizacaoAnterior = ultimasLocalizacoesPorBusId.get(mensagemNormalizada.busId);
      const timestampAnterior = Date.parse(localizacaoAnterior?.timestamp ?? '');
      const timestampAtual = Date.parse(mensagemNormalizada.timestamp);

      if (Number.isFinite(timestampAnterior) && timestampAtual <= timestampAnterior) {
        enviarJson(ws, {
          type: 'location_ignored',
          reason: 'stale_timestamp',
          busId: mensagemNormalizada.busId,
          timestamp: mensagemNormalizada.timestamp,
        });
        return;
      }

      if (meta && meta.busId !== mensagemNormalizada.busId) {
        const localizacaoMetaAnterior = ultimasLocalizacoesPorBusId.get(meta.busId);
        if (localizacaoMetaAnterior) {
          const disconnectedAt = new Date().toISOString();
          ultimasLocalizacoesPorBusId.set(meta.busId, {
            ...localizacaoMetaAnterior,
            disconnectedAt,
          });
          broadcast({
            type: 'bus_disconnected',
            busId: meta.busId,
            timestamp: disconnectedAt,
          });
        }
        meta.busId = mensagemNormalizada.busId;
      }
      ultimasLocalizacoesPorBusId.set(mensagemNormalizada.busId, mensagemNormalizada);
      broadcast(mensagemNormalizada);
    } catch {
      enviarJson(ws, { type: 'error', message: 'Mensagem nao eh JSON valido.' });
    }
  });

  ws.on('close', () => {
    const meta = metaPorConexao.get(ws);
    // Em modo auto-assign, marca desconexao sem perder a ultima posicao real.
    if (AUTO_ASSIGN_BUS_ID && meta?.busId) {
      const localizacaoAnterior = ultimasLocalizacoesPorBusId.get(meta.busId);
      if (localizacaoAnterior) {
        const disconnectedAt = new Date().toISOString();
        ultimasLocalizacoesPorBusId.set(meta.busId, {
          ...localizacaoAnterior,
          disconnectedAt,
        });
        broadcast({
          type: 'bus_disconnected',
          busId: meta.busId,
          timestamp: disconnectedAt,
        });
      }
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
});

server.on('error', (error) => {
  console.error('[http] erro ao iniciar servidor:', error.message);
});

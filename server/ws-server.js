import http from 'node:http';
import process from 'node:process';
import { WebSocketServer, WebSocket } from 'ws';

const PORT = Number(process.env.PORT ?? process.env.WS_PORT ?? 8080);
const HOST = process.env.WS_HOST ?? '0.0.0.0';
const BUS_ID_PADRAO = process.env.BUS_ID ?? 'interno';
const AUTH_TOKEN = process.env.WS_AUTH_TOKEN ?? '';

const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'content-type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ ok: true, service: 'bus-ws', time: new Date().toISOString() }));
    return;
  }

  res.writeHead(200, { 'content-type': 'text/plain; charset=utf-8' });
  res.end('Bus location WebSocket server online.');
});

const wss = new WebSocketServer({ server });
let ultimaLocalizacao = null;
// MODO MULTI-ÔNIBUS (deixe comentado por enquanto):
// 1) Troque a linha acima por:
// let ultimasLocalizacoesPorBusId = new Map();
// 2) Ao conectar cliente, no lugar de enviar `ultimaLocalizacao`, envie:
// for (const localizacao of ultimasLocalizacoesPorBusId.values()) {
//   enviarJson(ws, localizacao);
// }
// 3) Ao receber mensagem, no lugar de `ultimaLocalizacao = mensagemNormalizada`, use:
// ultimasLocalizacoesPorBusId.set(mensagemNormalizada.busId, mensagemNormalizada);

const enviarJson = (cliente, payload) => {
  if (cliente.readyState === WebSocket.OPEN) {
    cliente.send(JSON.stringify(payload));
  }
};

const validarMensagemLocalizacao = (payload) => {
  if (!payload || typeof payload !== 'object') return false;
  if (payload.type !== 'bus_location') return false;
  if (AUTH_TOKEN && payload.token !== AUTH_TOKEN) return false;
  if (typeof payload.lat !== 'number' || typeof payload.lng !== 'number') return false;
  if (!Number.isFinite(payload.lat) || !Number.isFinite(payload.lng)) return false;
  if (payload.lat < -90 || payload.lat > 90 || payload.lng < -180 || payload.lng > 180) return false;
  return true;
};

const normalizarMensagemLocalizacao = (payload) => ({
  type: 'bus_location',
  busId: typeof payload.busId === 'string' && payload.busId.trim() ? payload.busId : BUS_ID_PADRAO,
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
  console.log(`[ws] cliente conectado: ${req.socket.remoteAddress}`);

  enviarJson(ws, {
    type: 'hello',
    message: 'Conectado ao servidor de localizacao',
    expectedFormat: {
      type: 'bus_location',
      busId: BUS_ID_PADRAO,
      lat: -32.0754,
      lng: -52.1536,
      timestamp: new Date().toISOString(),
    },
  });

  if (ultimaLocalizacao) {
    enviarJson(ws, ultimaLocalizacao);
  }

  ws.on('message', (raw) => {
    try {
      const payload = JSON.parse(raw.toString());

      if (!validarMensagemLocalizacao(payload)) {
        enviarJson(ws, { type: 'error', message: 'Formato invalido para bus_location.' });
        return;
      }

      const mensagemNormalizada = normalizarMensagemLocalizacao(payload);
      ultimaLocalizacao = mensagemNormalizada;
      broadcast(mensagemNormalizada);
    } catch {
      enviarJson(ws, { type: 'error', message: 'Mensagem nao eh JSON valido.' });
    }
  });

  ws.on('close', () => {
    console.log('[ws] cliente desconectado');
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

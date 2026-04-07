import { WebSocketServer, WebSocket } from 'ws';
import process from 'node:process';

const PORT = Number(process.env.WS_PORT ?? 8080);
const HOST = process.env.WS_HOST ?? '0.0.0.0';
const BUS_ID_PADRAO = process.env.BUS_ID ?? 'interno';

const wss = new WebSocketServer({ port: PORT, host: HOST });
let ultimaLocalizacao = null;

const enviarJson = (cliente, payload) => {
  if (cliente.readyState === WebSocket.OPEN) {
    cliente.send(JSON.stringify(payload));
  }
};

const validarMensagemLocalizacao = (payload) => {
  if (!payload || typeof payload !== 'object') return false;
  if (payload.type !== 'bus_location') return false;
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

wss.on('listening', () => {
  console.log(`[ws] servidor ouvindo em ws://${HOST}:${PORT}`);
});

wss.on('error', (error) => {
  console.error('[ws] erro ao iniciar servidor:', error.message);
});

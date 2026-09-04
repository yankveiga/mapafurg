import { useEffect, useRef, useState } from 'react';
import { processarAtualizacaoOnibus } from '../services/busTracking';

export const normalizarWsUrl = (url) => {
  if (!url) return null;
  const limpa = url.trim().replace(/\/+$/, '');
  if (limpa.startsWith('wss://') || limpa.startsWith('ws://')) return limpa;
  if (limpa.startsWith('https://')) return limpa.replace('https://', 'wss://');
  if (limpa.startsWith('http://')) return limpa.replace('http://', 'ws://');
  return null;
};

export function useBusLocations(wsUrl) {
  const [onibusPorId, setOnibusPorId] = useState({});
  const [statusWs, setStatusWs] = useState('desconectado');
  const reconnectRef = useRef(null);

  useEffect(() => {
    let ws = null;
    let ativo = true;

    const conectar = () => {
      if (!ativo) return;
      if (!wsUrl) {
        setStatusWs('erro');
        return;
      }

      setStatusWs('conectando');
      try {
        ws = new WebSocket(wsUrl);
      } catch {
        setStatusWs('erro');
        reconnectRef.current = window.setTimeout(conectar, 3000);
        return;
      }

      ws.onopen = () => setStatusWs('conectado');

      ws.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);

          if (payload.type === 'bus_disconnected') {
            if (typeof payload.busId !== 'string' || !payload.busId.trim()) return;
            setOnibusPorId((anterior) => {
              const busId = payload.busId.trim();
              if (!anterior[busId]) return anterior;

              return {
                ...anterior,
                [busId]: {
                  ...anterior[busId],
                  disconnectedAt: payload.timestamp ?? new Date().toISOString(),
                },
              };
            });
            return;
          }

          if (payload.type !== 'bus_location') return;
          if (typeof payload.busId !== 'string' || !payload.busId.trim()) return;
          if (!Number.isFinite(payload.lat) || !Number.isFinite(payload.lng)) return;

          const busId = payload.busId.trim();
          setOnibusPorId((anterior) => {
            const posicaoAtualizada = processarAtualizacaoOnibus(payload, anterior[busId]);
            if (!posicaoAtualizada) return anterior;

            return {
              ...anterior,
              [busId]: posicaoAtualizada,
            };
          });
        } catch {
          // Ignora mensagens nao-JSON enviadas por clientes externos.
        }
      };

      ws.onerror = () => setStatusWs('erro');

      ws.onclose = () => {
        if (!ativo) return;
        setStatusWs('desconectado');
        reconnectRef.current = window.setTimeout(conectar, 3000);
      };
    };

    conectar();

    return () => {
      ativo = false;
      if (reconnectRef.current) {
        window.clearTimeout(reconnectRef.current);
      }
      ws?.close();
    };
  }, [wsUrl]);

  return { onibusPorId, statusWs };
}

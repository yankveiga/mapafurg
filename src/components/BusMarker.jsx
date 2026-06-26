import { useEffect, useMemo, useRef, useState } from 'react';
import { Marker } from 'react-leaflet';
import { criarIconeOnibusAoVivo } from '../mapIcons';

const easeOutCubic = (valor) => 1 - (1 - valor) ** 3;

export function BusMarker({ posicao, config, onClick }) {
  const markerRef = useRef(null);
  const animationFrameRef = useRef(null);
  const [posicaoInicial] = useState(() => [posicao.lat, posicao.lng]);
  const icon = useMemo(() => criarIconeOnibusAoVivo(config.icone), [config.icone]);

  useEffect(() => {
    const marker = markerRef.current;
    if (!marker) return;

    if (animationFrameRef.current) {
      window.cancelAnimationFrame(animationFrameRef.current);
    }

    const origem = marker.getLatLng();
    const destino = { lat: posicao.lat, lng: posicao.lng };
    const duracao = posicao.interpolationMs ?? 600;

    if (duracao <= 0) {
      marker.setLatLng([destino.lat, destino.lng]);
      return;
    }

    const inicio = performance.now();

    const animar = (agora) => {
      const progressoLinear = Math.min((agora - inicio) / duracao, 1);
      const progresso = easeOutCubic(progressoLinear);
      marker.setLatLng([
        origem.lat + (destino.lat - origem.lat) * progresso,
        origem.lng + (destino.lng - origem.lng) * progresso,
      ]);

      if (progressoLinear < 1) {
        animationFrameRef.current = window.requestAnimationFrame(animar);
      }
    };

    animationFrameRef.current = window.requestAnimationFrame(animar);

    return () => {
      if (animationFrameRef.current) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [posicao.interpolationMs, posicao.lat, posicao.lng]);

  return (
    <Marker
      ref={markerRef}
      position={posicaoInicial}
      icon={icon}
      zIndexOffset={1500}
      eventHandlers={{ click: onClick }}
    />
  );
}

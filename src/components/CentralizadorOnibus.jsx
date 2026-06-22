import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';

export function CentralizadorOnibus({ focar, posicao }) {
  const map = useMap();
  const posicaoRef = useRef(posicao);

  useEffect(() => {
    posicaoRef.current = posicao;
  }, [posicao]);

  useEffect(() => {
    const posicaoAtual = posicaoRef.current;
    if (!focar || !posicaoAtual) return;
    map.flyTo([posicaoAtual.lat, posicaoAtual.lng], 18, { animate: true, duration: 1.1 });
  }, [focar, map]);

  return null;
}

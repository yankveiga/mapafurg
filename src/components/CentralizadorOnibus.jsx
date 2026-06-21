import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

export function CentralizadorOnibus({ focar, posicao }) {
  const map = useMap();

  useEffect(() => {
    if (!focar || !posicao) return;
    map.flyTo([posicao.lat, posicao.lng], 18, { animate: true, duration: 1.1 });
  }, [focar, map]);

  return null;
}

import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

export function Bussola({ alvo }) {
  const map = useMap();

  useEffect(() => {
    if (alvo) {
      map.flyTo([alvo.lat - 0.0005, alvo.lng], 17, { animate: true, duration: 1.2 });
    }
  }, [alvo, map]);

  return null;
}

import { useEffect, useRef, useState } from 'react';
import { Marker, useMap, useMapEvents } from 'react-leaflet';
import { criarIconeLocalizacaoUsuario } from '../mapIcons';

export function Localizador({ focar }) {
  const [posicao, setPosicao] = useState(null);
  const map = useMap();
  const rastreandoRef = useRef(false);
  const centralizarProximaLocalizacaoRef = useRef(false);
  const posicaoAtualRef = useRef(null);

  useMapEvents({
    locationfound(e) {
      posicaoAtualRef.current = e.latlng;
      setPosicao(e.latlng);
      if (centralizarProximaLocalizacaoRef.current) {
        map.flyTo(e.latlng, 18);
        centralizarProximaLocalizacaoRef.current = false;
      }
    },
  });

  useEffect(() => {
    if (!focar) return;

    centralizarProximaLocalizacaoRef.current = true;

    if (posicaoAtualRef.current) {
      map.flyTo(posicaoAtualRef.current, 18);
      centralizarProximaLocalizacaoRef.current = false;
    }

    if (!rastreandoRef.current) {
      rastreandoRef.current = true;
      map.locate({
        setView: false,
        enableHighAccuracy: true,
        watch: true,
        maximumAge: 1000,
        timeout: 10000,
      });
    }
  }, [focar, map]);

  useEffect(() => {
    return () => {
      map.stopLocate();
    };
  }, [map]);

  return posicao === null ? null : (
    <Marker
      position={posicao}
      icon={criarIconeLocalizacaoUsuario()}
      zIndexOffset={1000}
    />
  );
}

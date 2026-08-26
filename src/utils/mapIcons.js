import L from 'leaflet';

export const criarIconeLocalizacaoUsuario = () => L.divIcon({
  className: 'bg-transparent',
  html: '<div class="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-[0_0_15px_rgba(59,130,246,0.8)] animate-pulse"></div>',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

export const criarIconePredio = (sigla) => {
  const tamanhoFonte = sigla.length > 4 ? 'text-[7px]' : 'text-[10px]';

  return L.divIcon({
    className: 'bg-transparent',
    html: `<div class="bg-[#003366] text-white font-bold ${tamanhoFonte} rounded-full border-2 border-white shadow-md px-2 min-w-[40px] h-6 flex items-center justify-center whitespace-nowrap -translate-x-1/2 -translate-y-1/2">${sigla.toUpperCase()}</div>`,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });
};

export const criarIconeOnibusAoVivo = (icone = '/map-icons/interno.svg') => L.divIcon({
  className: 'bg-transparent',
  html: `
    <div style="width: 36px; height: 36px; transform: translate(-50%, -50%); display: flex; align-items: center; justify-content: center;">
      <img
        src="${icone}"
        alt=""
        style="width: 36px; height: 36px; object-fit: contain; filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.35));"
      />
    </div>
  `,
  iconSize: [0, 0],
  iconAnchor: [0, 0],
});

export const criarIconeCluster = (cluster) => {
  const quantidade = cluster.getChildCount();
  const tamanho = quantidade > 8 ? 'w-12 h-12 text-base' : 'w-9 h-9 text-sm';
  const sombra = quantidade > 8 ? 'shadow-[0_0_25px_rgba(0,51,102,0.5)]' : 'shadow-md';

  return L.divIcon({
    html: `<div class="bg-gradient-to-br from-[#003366] to-blue-800 text-white font-black rounded-full border-2 border-white/90 ${sombra} ${tamanho} flex items-center justify-center -translate-x-1/2 -translate-y-1/2 transition-all hover:scale-110">${quantidade}</div>`,
    className: 'bg-transparent',
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });
};

import L from 'leaflet';

export const criarIconeLocalizacaoUsuario = () => L.divIcon({
  className: 'bg-transparent',
  html: '<div class="w-4 h-4 bg-furg-navy rounded-full border-2 border-white shadow-[0_0_15px_rgba(0,51,102,0.55)] animate-pulse"></div>',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

export const criarIconePredio = (sigla, opcoes = {}) => {
  const destacado = Boolean(opcoes.destacado);
  const selecionado = Boolean(opcoes.selecionado);
  const tamanhoFonte = sigla.length > 4 ? 'text-[7px]' : 'text-[10px]';
  const estadoClasse = selecionado
    ? 'marker-pop bg-white text-furg-navy border-furg-navy ring-4 ring-furg-navy/18 shadow-[0_10px_26px_rgba(0,51,102,0.36)] scale-110'
    : destacado
      ? 'bg-furg-navy text-white border-white ring-4 ring-furg-navy/16 shadow-[0_8px_22px_rgba(0,51,102,0.34)] scale-105'
      : 'bg-furg-navy text-white border-white shadow-[0_5px_14px_rgba(0,51,102,0.26)]';

  return L.divIcon({
    className: 'bg-transparent',
    html: `
      <div class="relative -translate-x-1/2 -translate-y-1/2 transition-transform duration-200">
        ${selecionado ? '<div class="marker-selected-halo absolute left-1/2 top-1/2 h-10 w-10 rounded-full bg-furg-navy/25"></div>' : ''}
        <div class="${estadoClasse} font-bold ${tamanhoFonte} rounded-full border-2 px-2 min-w-[40px] h-6 flex items-center justify-center whitespace-nowrap">
          ${sigla.toUpperCase()}
        </div>
      </div>
    `,
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
  const sombra = quantidade > 8 ? 'shadow-[0_12px_30px_rgba(0,51,102,0.34)]' : 'shadow-[0_8px_20px_rgba(0,51,102,0.24)]';

  return L.divIcon({
    html: `<div class="bg-gradient-to-br from-furg-navy to-furg-navy-soft text-white font-black rounded-full border-2 border-white/90 ${sombra} ${tamanho} flex items-center justify-center -translate-x-1/2 -translate-y-1/2 transition-all duration-200 hover:scale-110">${quantidade}</div>`,
    className: 'bg-transparent',
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });
};

export const ID_PONTO_ONIBUS = 'interno';

export const POSICAO_INICIAL_ONIBUS = {
  lat: -32.07488993829145,
  lng: -52.15502479544119,
  timestamp: null,
};

export const STATUS_WS = {
  conectando: 'Conectando...',
  conectado: 'Ao vivo',
  erro: 'Erro de conexão',
  desconectado: 'Offline',
};

export const ONIBUS_CONFIG = {
  onibus_amarelo: {
    nome: 'Interno Amarelo',
    icone: '/map-icons/interno.svg',
    acessivel: true,
  },
  onibus_branco: {
    nome: 'Interno Branco',
    icone: '/map-icons/interno.svg',
    acessivel: false,
  },
  onibus_teste: {
    nome: 'Ônibus Teste',
    icone: '/map-icons/interno.svg',
    acessivel: false,
    teste: true,
  },
};

export const ONIBUS_PADRAO = {
  nome: 'Ônibus Interno',
  icone: '/map-icons/interno.svg',
  acessivel: null,
};

export const obterConfigOnibus = (busId) => ONIBUS_CONFIG[busId] ?? ONIBUS_PADRAO;

export const obterOnibusPrincipal = (onibusPorId) => {
  const entradas = Object.entries(onibusPorId);
  if (entradas.length === 0) return POSICAO_INICIAL_ONIBUS;

  return entradas.reduce((maisRecente, [, atual]) => {
    const atualMs = Date.parse(atual.timestamp ?? '');
    const maisRecenteMs = Date.parse(maisRecente.timestamp ?? '');
    if (!Number.isFinite(atualMs)) return maisRecente;
    if (!Number.isFinite(maisRecenteMs)) return atual;
    return atualMs > maisRecenteMs ? atual : maisRecente;
  }, entradas[0][1]);
};

export const formatarTempoDecorrido = (timestamp, agoraMs) => {
  if (!timestamp) return 'sem atualização';
  const ms = agoraMs - Date.parse(timestamp);
  if (!Number.isFinite(ms) || ms < 1000) return 'agora';

  const segundos = Math.floor(ms / 1000);
  if (segundos < 60) return `há ${segundos}s`;

  const minutos = Math.floor(segundos / 60);
  if (minutos < 60) return `há ${minutos}min`;

  const horas = Math.floor(minutos / 60);
  return `há ${horas}h`;
};

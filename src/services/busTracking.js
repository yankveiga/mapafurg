export const BUS_TRACKING_CONFIG = {
  // Impede que uma mensagem atrasada substitua uma posicao mais recente.
  discardStaleTimestamps: true,
  // Ignora leituras cujo raio estimado de erro do GPS seja maior que 40 metros.
  maxAccuracyMeters: 40,
  // Mantem o marcador parado quando a mudanca de posicao for menor que 2 metros.
  minMovementMeters: 2,
  // Descarta saltos que exigiriam velocidade superior a 30 m/s (108 km/h).
  maxPlausibleSpeedMps: 30,
  // Duracao minima, em milissegundos, do deslizamento entre duas posicoes.
  minInterpolationMs: 900,
  // Duracao maxima pensada para GPS a cada 3s: desliza e ainda sobra uma pausa visual.
  maxInterpolationMs: 2200,
  // Mantem 100% enquanto o GPS esta dentro da janela normal de atualizacao.
  freshPositionMs: 10_000,
  // Abaixo deste ponto a posicao ja esta claramente envelhecida.
  stalePositionMs: 30_000,
  // Depois de 60s, preserva o marcador bem transparente, mas ainda visivel.
  offlinePositionMs: 60_000,
  minOfflineOpacity: 0.3,
};

/*
 * Configuracao alternativa para desativar filtros e interpolacao.
 * Para usar, comente o bloco BUS_TRACKING_CONFIG acima e descomente este.
 *
 * export const BUS_TRACKING_CONFIG = {
 *   discardStaleTimestamps: false,
 *   maxAccuracyMeters: Infinity,
 *   minMovementMeters: 0,
 *   maxPlausibleSpeedMps: Infinity,
 *   minInterpolationMs: 0,
 *   maxInterpolationMs: 0,
 * };
 */

const toRadians = (degrees) => degrees * Math.PI / 180;

export const calcularDistanciaMetros = (origem, destino) => {
  const earthRadiusMeters = 6371000;
  const lat1 = toRadians(origem.lat);
  const lat2 = toRadians(destino.lat);
  const deltaLat = toRadians(destino.lat - origem.lat);
  const deltaLng = toRadians(destino.lng - origem.lng);

  const a = Math.sin(deltaLat / 2) ** 2
    + Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadiusMeters * c;
};

const obterTimestamp = (payload) => {
  const timestampPayload = Date.parse(payload.timestamp ?? '');
  if (Number.isFinite(timestampPayload)) return timestampPayload;

  const timestampServidor = Date.parse(payload.serverReceivedAt ?? '');
  return Number.isFinite(timestampServidor) ? timestampServidor : Date.now();
};

const limitar = (valor, minimo, maximo) => Math.min(maximo, Math.max(minimo, valor));

export const calcularOpacidadeOnibus = (timestamp, agoraMs = Date.now()) => {
  const timestampMs = Date.parse(timestamp ?? '');
  if (!Number.isFinite(timestampMs)) return BUS_TRACKING_CONFIG.minOfflineOpacity;

  const idadeMs = Math.max(0, agoraMs - timestampMs);
  if (idadeMs <= BUS_TRACKING_CONFIG.freshPositionMs) return 1;

  if (idadeMs <= BUS_TRACKING_CONFIG.stalePositionMs) {
    const progresso = (idadeMs - BUS_TRACKING_CONFIG.freshPositionMs)
      / (BUS_TRACKING_CONFIG.stalePositionMs - BUS_TRACKING_CONFIG.freshPositionMs);
    return limitar(1 - progresso * 0.3, 0.7, 1);
  }

  if (idadeMs <= BUS_TRACKING_CONFIG.offlinePositionMs) {
    const progresso = (idadeMs - BUS_TRACKING_CONFIG.stalePositionMs)
      / (BUS_TRACKING_CONFIG.offlinePositionMs - BUS_TRACKING_CONFIG.stalePositionMs);
    return limitar(0.7 - progresso * 0.4, BUS_TRACKING_CONFIG.minOfflineOpacity, 0.7);
  }

  return BUS_TRACKING_CONFIG.minOfflineOpacity;
};

export const processarAtualizacaoOnibus = (payload, anterior) => {
  if (!Number.isFinite(payload.lat) || !Number.isFinite(payload.lng)) return null;

  const timestampMs = obterTimestamp(payload);
  const timestampAnteriorMs = Date.parse(anterior?.timestamp ?? '');
  if (
    BUS_TRACKING_CONFIG.discardStaleTimestamps
    && Number.isFinite(timestampAnteriorMs)
    && timestampMs <= timestampAnteriorMs
  ) return null;

  const accuracy = Number.isFinite(payload.accuracy) && payload.accuracy >= 0
    ? payload.accuracy
    : null;
  if (accuracy !== null && accuracy > BUS_TRACKING_CONFIG.maxAccuracyMeters) return null;

  const speed = Number.isFinite(payload.speed) && payload.speed >= 0
    ? payload.speed
    : null;

  let lat = payload.lat;
  let lng = payload.lng;
  let interpolationMs = BUS_TRACKING_CONFIG.minInterpolationMs;

  if (anterior && Number.isFinite(timestampAnteriorMs)) {
    const distanciaMetros = calcularDistanciaMetros(anterior, payload);
    const intervaloSegundos = (timestampMs - timestampAnteriorMs) / 1000;
    const velocidadeCalculada = intervaloSegundos > 0
      ? distanciaMetros / intervaloSegundos
      : 0;

    if (velocidadeCalculada > BUS_TRACKING_CONFIG.maxPlausibleSpeedMps) return null;

    if (distanciaMetros < BUS_TRACKING_CONFIG.minMovementMeters) {
      lat = anterior.lat;
      lng = anterior.lng;
    }

    interpolationMs = limitar(
      (timestampMs - timestampAnteriorMs) * 0.9,
      BUS_TRACKING_CONFIG.minInterpolationMs,
      BUS_TRACKING_CONFIG.maxInterpolationMs
    );
  }

  return {
    lat,
    lng,
    timestamp: new Date(timestampMs).toISOString(),
    serverReceivedAt: payload.serverReceivedAt ?? null,
    speed,
    accuracy,
    interpolationMs,
    disconnectedAt: null,
  };
};

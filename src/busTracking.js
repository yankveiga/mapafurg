export const BUS_TRACKING_CONFIG = {
  maxAccuracyMeters: 40,
  minMovementMeters: 2,
  minSpeedForBearingMps: 0.8,
  maxPlausibleSpeedMps: 30,
  minInterpolationMs: 600,
  maxInterpolationMs: 2800,
};

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

export const normalizarBearing = (bearing) => (
  Number.isFinite(bearing) ? ((bearing % 360) + 360) % 360 : null
);

const obterTimestamp = (payload) => {
  const timestampPayload = Date.parse(payload.timestamp ?? '');
  if (Number.isFinite(timestampPayload)) return timestampPayload;

  const timestampServidor = Date.parse(payload.serverReceivedAt ?? '');
  return Number.isFinite(timestampServidor) ? timestampServidor : Date.now();
};

const limitar = (valor, minimo, maximo) => Math.min(maximo, Math.max(minimo, valor));

export const processarAtualizacaoOnibus = (payload, anterior) => {
  if (!Number.isFinite(payload.lat) || !Number.isFinite(payload.lng)) return null;

  const timestampMs = obterTimestamp(payload);
  const timestampAnteriorMs = Date.parse(anterior?.timestamp ?? '');
  if (Number.isFinite(timestampAnteriorMs) && timestampMs <= timestampAnteriorMs) return null;

  const accuracy = Number.isFinite(payload.accuracy) && payload.accuracy >= 0
    ? payload.accuracy
    : null;
  if (accuracy !== null && accuracy > BUS_TRACKING_CONFIG.maxAccuracyMeters) return null;

  const speed = Number.isFinite(payload.speed) && payload.speed >= 0
    ? payload.speed
    : null;
  const bearingRecebido = normalizarBearing(
    Number.isFinite(payload.bearing) ? payload.bearing : payload.heading
  );

  let lat = payload.lat;
  let lng = payload.lng;
  let bearing = anterior?.bearing ?? bearingRecebido ?? 0;
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

  const estaEmMovimento = speed === null || speed >= BUS_TRACKING_CONFIG.minSpeedForBearingMps;
  if (bearingRecebido !== null && (estaEmMovimento || !anterior)) {
    bearing = bearingRecebido;
  }

  return {
    lat,
    lng,
    timestamp: new Date(timestampMs).toISOString(),
    serverReceivedAt: payload.serverReceivedAt ?? null,
    speed,
    accuracy,
    bearing,
    interpolationMs,
  };
};

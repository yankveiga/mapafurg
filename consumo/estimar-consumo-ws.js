import { Buffer } from 'node:buffer';

const INTERVALO_SEGUNDOS = 3;
const DIAS_NO_MES = 30;
const HORAS_NO_DIA = 24;
const TOKEN_LENGTH = 37;

const timestamp = '2026-06-09T12:00:00.000Z';
const serverReceivedAt = '2026-06-09T12:00:01.000Z';
const tokenPlaceholder = 'x'.repeat(TOKEN_LENGTH);

const payloadCelular = {
  type: 'bus_location',
  busId: 'interno',
  lat: -32.07548437944093,
  lng: -52.153652687153084,
  timestamp,
  token: tokenPlaceholder,
  speed: 8.7,
  accuracy: 6.2,
  bearing: 123.45,
};

const payloadServidor = {
  type: 'bus_location',
  busId: 'bus-1',
  lat: payloadCelular.lat,
  lng: payloadCelular.lng,
  bearing: payloadCelular.bearing,
  speed: payloadCelular.speed,
  accuracy: payloadCelular.accuracy,
  timestamp,
  serverReceivedAt,
};

const cenarios = [
  { nome: '1 onibus - 1 conexao', onibus: 1, conexoes: 1 },
  { nome: '2 onibus - 1 conexao', onibus: 2, conexoes: 1 },
  { nome: '1 onibus - 50 conexoes', onibus: 1, conexoes: 50 },
  { nome: '2 onibus - 50 conexoes', onibus: 2, conexoes: 50 },
  { nome: '2 onibus - 200 conexoes', onibus: 2, conexoes: 200 },
];

const bytes = (payload) => Buffer.byteLength(JSON.stringify(payload), 'utf8');
const formatarMb = (bytesTotal) => `${(bytesTotal / 1_000_000).toFixed(3)} MB`;
const formatarGb = (bytesTotal) => `${(bytesTotal / 1_000_000_000).toFixed(3)} GB`;

const bytesEntrada = bytes(payloadCelular);
const bytesSaidaPorConexao = bytes(payloadServidor);
const enviosPorHora = 3600 / INTERVALO_SEGUNDOS;
const enviosPorMes = enviosPorHora * HORAS_NO_DIA * DIAS_NO_MES;

const calcularConsumoMensal = ({ onibus, conexoes }) => {
  const bytesPorEnvio = onibus * (bytesEntrada + bytesSaidaPorConexao * conexoes);
  return bytesPorEnvio * enviosPorMes;
};

console.log('Estimativa de consumo WebSocket');
console.log(`Intervalo: ${INTERVALO_SEGUNDOS}s`);
console.log(`Envios por onibus no mes: ${enviosPorMes.toLocaleString('pt-BR')}`);
console.log(`Celular -> servidor: ${bytesEntrada} bytes por envio`);
console.log(`Servidor -> mapa: ${bytesSaidaPorConexao} bytes por conexao`);
console.log('');

console.table(
  cenarios.map((cenario) => {
    const total = calcularConsumoMensal(cenario);
    return {
      Periodo: cenario.nome,
      'Consumo mensal': total >= 1_000_000_000 ? formatarGb(total) : formatarMb(total),
      'Consumo mensal MB': formatarMb(total),
    };
  })
);

# Mapa FURG

Mapa interativo do Campus Carreiros da FURG, com busca por prédios, detalhes dos locais, geolocalização do usuário e rastreamento em tempo real do ônibus interno.

O projeto combina um frontend em React/Vite com um servidor WebSocket em Node.js. O mapa é uma PWA e usa Leaflet com dados do OpenStreetMap.

## Funcionalidades

- Busca por prédios, siglas, aliases, salas e termos curados.
- Painel com descrição, projetos, horários, cardápios e informações do ônibus interno.
- Geolocalização do usuário no mapa.
- Rastreamento em tempo real do ônibus via WebSocket.
- Movimento suavizado do marcador entre posições reais recebidas.
- Opacidade do marcador conforme a idade da última posição.
- Cliente de teste WebSocket para simular envio de localização.

## Stack

- React
- Vite
- Leaflet + React Leaflet
- Tailwind CSS
- Node.js + `ws`
- Vite Plugin PWA

## Rodando Localmente

Instale as dependências:

```bash
npm install
```

Frontend:

```bash
npm run dev
```

Servidor WebSocket:

```bash
npm run ws:server
```

Frontend e WebSocket juntos:

```bash
npm run dev:all
```

URLs padrão:

- Mapa: `http://localhost:5173`
- WebSocket: `ws://localhost:8080`
- Testador WebSocket: `http://localhost:5173/ws-tester.html`

## Scripts

```bash
npm run dev
npm run dev:websocket
npm run ws:server
npm run dev:all
npm run estimate:ws
npm run build
npm run preview
npm run lint
```

## Rastreamento Do Ônibus

O rastreador externo envia mensagens `bus_location` para o servidor WebSocket. O servidor valida, normaliza e retransmite a última localização para os mapas conectados.

Exemplo de payload:

```json
{
  "type": "bus_location",
  "busId": "interno",
  "lat": -32.07548,
  "lng": -52.15365,
  "speed": 8.2,
  "accuracy": 5.4,
  "timestamp": "2026-04-07T12:00:00.000Z"
}
```

Campos obrigatórios:

- `type`
- `lat`
- `lng`

O `busId` é opcional, mas recomendado. Hoje o projeto usa:

- `interno`: ônibus atual, mantido por compatibilidade.
- `interno_branco`: ônibus branco.
- `onibus_teste`: rastreador de teste.

Se o rastreador não enviar `busId`, o servidor pode atribuir um ID automático, como `bus-1`, quando `AUTO_ASSIGN_BUS_ID=true`.

## Movimento E Offline

A posição recebida pelo GPS é sempre a posição real. A interpolação acontece só no frontend, para evitar saltos visuais no marcador. Nenhuma coordenada interpolada é enviada ao backend ou pelo WebSocket.

O marcador:

- anima entre uma posição real e a próxima;
- cancela a animação anterior se uma nova posição chegar no meio do caminho;
- para na última posição real quando as atualizações cessam;
- fica mais transparente conforme a posição envelhece;
- permanece visível mesmo offline.

Limites atuais de opacidade:

- até `10s`: `100%`
- entre `10s` e `30s`: até cerca de `70%`
- entre `30s` e `60s`: até cerca de `30%`
- acima de `60s`: cerca de `30%`

O intervalo de envio usado como referência é `3s`. A duração da interpolação fica entre `900ms` e `2200ms`.

## Variáveis De Ambiente

Frontend:

- `VITE_WS_URL`: URL do WebSocket em produção. Sem ela, o mapa usa `ws://<host>:8080`.

Servidor WebSocket:

- `PORT`
- `WS_PORT`
- `WS_HOST`
- `BUS_ID`
- `BUS_ID_PREFIX`
- `AUTO_ASSIGN_BUS_ID`
- `WS_AUTH_TOKEN`

## Testando O WebSocket

Rode o frontend e o servidor:

```bash
npm run dev:all
```

Abra:

```text
http://localhost:5173/ws-tester.html
```

O testador permite conectar ao servidor e enviar coordenadas sem depender do celular rastreador.

## Estrutura

```text
src/
  App.jsx
  main.jsx
  index.css
  components/
    map/
    ui/
  data/
    aviso.js
    onibus.js
    predios.js
  hooks/
    useBusLocations.js
  services/
    busTracking.js
  utils/
    buscas.js
    mapIcons.js

server/
  ws-server.js

public/
  ws-tester.html
  map-icons/

scripts/
  estimar-consumo-ws.js

docs/
  GUIA_CODIGO_MAPAFURG.txt
  explicacao.txt
  rascunho-relato-tecnologico.txt
```

## Manutenção

Dados dos prédios ficam em [`src/data/predios.js`](./src/data/predios.js).

Regras de busca ficam em [`src/utils/buscas.js`](./src/utils/buscas.js).

Configuração dos ônibus fica em [`src/data/onibus.js`](./src/data/onibus.js). Para trocar o ícone de um ônibus, coloque o SVG em `public/map-icons/` e ajuste o campo `icone`.

Filtros de telemetria, interpolação e opacidade ficam em [`src/services/busTracking.js`](./src/services/busTracking.js).

O servidor WebSocket fica em [`server/ws-server.js`](./server/ws-server.js).

## Build

```bash
npm run build
```

Para testar a build localmente:

```bash
npm run preview
```

## Estimativa De Tráfego

```bash
npm run estimate:ws
```

O cálculo usa o intervalo de `3s` por rastreador e fica em [`scripts/estimar-consumo-ws.js`](./scripts/estimar-consumo-ws.js).

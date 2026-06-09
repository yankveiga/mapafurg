# Mapa FURG

Aplicação web para visualização interativa do Campus Carreiros da FURG, com busca por prédios, atalhos rápidos, geolocalização do usuário e suporte a rastreamento em tempo real do ônibus interno.

O projeto é dividido em duas frentes:

- `frontend` em React + Vite, publicado como aplicação web/PWA
- `backend` WebSocket em Node.js, responsável por distribuir coordenadas do ônibus para os clientes conectados

## Tecnologias

- React
- Vite
- Leaflet + React Leaflet
- Tailwind CSS
- `ws` para WebSocket
- Vite Plugin PWA

## Funcionalidades

- mapa interativo do campus com marcadores dos prédios
- busca por nome, sigla, aliases e termos curados
- painel com detalhes do local selecionado
- geolocalização do usuário
- atualização em tempo real do ônibus interno
- centralização manual no ônibus
- indicação da última atualização recebida
- rastro recente de deslocamento do ônibus
- suporte a PWA

## Requisitos

- Node.js `18+`
- npm

## Desenvolvimento local

Instale as dependências:

```bash
npm install
```

Suba apenas o frontend:

```bash
npm run dev
```

Suba apenas o servidor WebSocket:

```bash
npm run ws:server
```

Suba frontend e WebSocket em paralelo:

```bash
npm run dev:all
```

Por padrão:

- frontend: `http://localhost:5173`
- WebSocket: `ws://0.0.0.0:8080`

## Scripts disponíveis

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

## Rastreamento em tempo real

O servidor WebSocket recebe mensagens de localização e retransmite o último estado válido para os clientes conectados.

Formato esperado:

```json
{
  "type": "bus_location",
  "busId": "interno",
  "lat": -32.07548,
  "lng": -52.15365,
  "heading": 90,
  "speed": 8.2,
  "accuracy": 5.4,
  "timestamp": "2026-04-07T12:00:00.000Z"
}
```

Campos obrigatórios:

- `type`
- `lat`
- `lng`

Variáveis de ambiente suportadas pelo servidor:

- `PORT`
- `WS_PORT`
- `WS_HOST`
- `BUS_ID`
- `BUS_ID_PREFIX`
- `AUTO_ASSIGN_BUS_ID` (default: `true`)
- `WS_AUTH_TOKEN`

O frontend pode consumir um endpoint WebSocket externo por meio de `VITE_WS_URL`. Quando essa variável não é definida, o projeto usa fallback para `ws://<host>:8080` em ambiente local.

## Teste do WebSocket

Para validar o fluxo sem celular, use o arquivo:

- `public/ws-tester.html`

Com o projeto rodando localmente, abra:

- `http://localhost:5173/ws-tester.html`

Esse utilitário permite conectar ao servidor WebSocket e enviar coordenadas de teste no formato esperado pelo mapa.

## Estimativa de consumo do WebSocket

Para estimar o tráfego mensal gerado pelo rastreamento, rode:

```bash
npm.cmd run estimate:ws
```

No Windows, `npm.cmd` evita bloqueios de política de execução do PowerShell. Em outros ambientes, `npm run estimate:ws` também funciona.

O cálculo fica em [`consumo/estimar-consumo-ws.js`](./consumo/estimar-consumo-ws.js) e usa como base:

- intervalo de envio do app Android: `3s`
- payload do celular com `token`, `speed`, `accuracy` e `heading`: `223 bytes`
- payload retransmitido pelo servidor para cada mapa aberto: `219 bytes`
- mês de referência: `30 dias`

Exemplo de saída:

```text
1 onibus - 1 conexao:     381.888 MB
2 onibus - 1 conexao:     763.776 MB
1 onibus - 50 conexoes:   9.653 GB
2 onibus - 50 conexoes:   19.307 GB
2 onibus - 200 conexoes:  76.072 GB
```

Esses valores estimam o JSON trafegado pela aplicação. O consumo real de rede pode ser um pouco maior por overhead de WebSocket, TCP/IP e TLS em conexões `wss://`.

## Aplicativo Android

O repositório inclui a pasta [`android-bus-location`](./android-bus-location), com um aplicativo Android dedicado ao envio contínuo de localização.

Responsabilidades do app:

- obter localização do aparelho
- manter rastreamento em foreground service
- reconectar ao WebSocket quando necessário
- enviar payloads compatíveis com o servidor

As configurações específicas de implantação do app ficam no código Android e devem ser revisadas antes de gerar builds para uso real.

## Estrutura do projeto

```text
src/
  App.jsx          interface principal e lógica do mapa
  data.js          base de dados dos prédios e pontos de interesse
  buscas.js        normalização e tradução da busca
  main.jsx         bootstrap da aplicação React
  index.css        estilos globais

public/
  ws-tester.html   cliente simples para teste do WebSocket
  ...              ícones e assets do PWA

server/
  ws-server.js     servidor WebSocket / healthcheck HTTP

consumo/
  estimar-consumo-ws.js   estimador de tráfego mensal do WebSocket

android-bus-location/
  ...              app Android para envio de localização
```

## Manutenção

### Dados dos prédios

Os pontos do mapa ficam em [`src/data.js`](./src/data.js).

Cada item inclui, em geral:

- `id`
- `nome`
- `lat`
- `lng`
- `descricao`
- `aliases`
- `projetos`

### Busca e atalhos

As regras de normalização e tradução da busca ficam em [`src/buscas.js`](./src/buscas.js).

### Interface e comportamento do mapa

O fluxo principal da aplicação está em [`src/App.jsx`](./src/App.jsx).

## Build de produção

```bash
npm run build
```

Os arquivos gerados ficam em `dist/`.

Para validar localmente a build:

```bash
npm run preview
```

## Segurança e configuração

Este repositório não deve expor:

- tokens de autenticação do WebSocket
- URLs privadas de infraestrutura
- credenciais de deploy

Boas práticas recomendadas:

- manter segredos em variáveis de ambiente
- revisar `AppConfig.kt` e arquivos de deploy antes de publicar
- evitar commit de endpoints internos, túneis temporários e chaves reais

## Observações

- a base de prédios é estática no frontend
- o WebSocket é usado exclusivamente para atualização em tempo real do ônibus
- alterações em identificadores (`id`) podem exigir revisão de busca e atalhos
- mudanças no PWA devem ser acompanhadas de revisão em `vite.config.js`

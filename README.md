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
  "speed": 8.2,
  "accuracy": 5.4,
  "timestamp": "2026-04-07T12:00:00.000Z"
}
```

Campos obrigatórios:

- `type`
- `lat`
- `lng`

O campo `busId` é opcional. Quando o app rastreador envia um `busId` válido, o servidor preserva esse identificador, por exemplo `onibus_amarelo`, `onibus_branco` ou `onibus_teste`. Quando o campo não é enviado, o servidor mantém compatibilidade com o modo antigo e atribui um ID automático, como `bus-1`.

Variáveis de ambiente suportadas pelo servidor:

- `PORT`
- `WS_PORT`
- `WS_HOST`
- `BUS_ID`
- `BUS_ID_PREFIX`
- `AUTO_ASSIGN_BUS_ID` (default: `true`)
- `WS_AUTH_TOKEN`

Com `AUTO_ASSIGN_BUS_ID=true`, o servidor ainda aceita `busId` explícito. O autoassign é usado apenas quando o app não envia um identificador válido.

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

- intervalo de envio do app rastreador: `3s`
- payload do celular com `token`, `speed` e `accuracy`: `206 bytes`
- payload retransmitido pelo servidor para cada mapa aberto: `202 bytes`
- mês de referência: `30 dias`

Exemplo de saída:

```text
1 onibus - 1 conexao:     352.512 MB
2 onibus - 1 conexao:     705.024 MB
1 onibus - 50 conexoes:   8.904 GB
2 onibus - 50 conexoes:   17.809 GB
2 onibus - 200 conexoes:  70.167 GB
```

Esses valores estimam o JSON trafegado pela aplicação. O consumo real de rede pode ser um pouco maior por overhead de WebSocket, TCP/IP e TLS em conexões `wss://`.

## Rastreador externo

Este repositório não inclui o aplicativo rastreador usado no celular ou no dispositivo instalado no ônibus.

Para o rastreamento em tempo real funcionar, é necessário um app externo que:

- obtenha a localização do aparelho
- mantenha o envio ativo enquanto o rastreamento estiver ligado
- conecte ao servidor WebSocket configurado para o projeto
- envie mensagens `bus_location` no formato esperado pelo servidor
- reconecte automaticamente em caso de queda de rede

Esse app pode ser Android ou outra solução equivalente, desde que envie coordenadas válidas para o WebSocket do backend.

## Estrutura do projeto

```text
src/
  App.jsx          orquestra a tela principal do mapa
  data.js          base de dados dos prédios e pontos de interesse
  buscas.js        normalização e tradução da busca
  onibus.js        configuração dos ônibus rastreados e status
  busTracking.js   validação e filtros da telemetria recebida
  mapIcons.js      criação dos ícones Leaflet
  useBusLocations.js  conexão WebSocket e estado dos ônibus em tempo real
  main.jsx         bootstrap da aplicação React
  index.css        estilos globais
  components/
    BusMarker.jsx
    Bussola.jsx
    CentralizadorOnibus.jsx
    Localizador.jsx
    PredioDrawer.jsx

public/
  ws-tester.html   cliente simples para teste do WebSocket
  ...              ícones e assets do PWA

server/
  ws-server.js     servidor WebSocket / healthcheck HTTP

consumo/
  estimar-consumo-ws.js   estimador de tráfego mensal do WebSocket
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

Para adicionar um prédio, inclua um novo objeto no array `predios`. Se quiser que a busca encontre termos alternativos, preencha `aliases`. Se houver salas, laboratórios, horários ou cardápio, use os blocos opcionais já existentes como modelo.

### Busca e atalhos

As regras de normalização e tradução da busca ficam em [`src/buscas.js`](./src/buscas.js).

Quando um novo prédio precisar responder a apelidos ou buscas especiais, adicione os termos em `buscas.js` apontando para o `id` cadastrado em `data.js`.

### Ônibus rastreados

A configuração visual e operacional dos ônibus rastreados fica em [`src/onibus.js`](./src/onibus.js).

Nesse arquivo ficam:

- `ID_PONTO_ONIBUS`: id do ponto informativo do ônibus em `data.js`
- `POSICAO_INICIAL_ONIBUS`: posição exibida quando não há ônibus online
- `STATUS_WS`: rótulos de conexão exibidos na interface
- `ONIBUS_CONFIG`: cadastro dos ônibus conhecidos, como `onibus_amarelo`, `onibus_branco` e `onibus_teste`
- `ONIBUS_PADRAO`: fallback para IDs antigos ou genéricos, como `bus-1`

Para trocar o ícone de um ônibus, coloque o arquivo em `public/` e altere o campo `icone` em `ONIBUS_CONFIG`.

Para adicionar um novo ônibus, cadastre um novo item em `ONIBUS_CONFIG` e configure o app rastreador para enviar o mesmo `busId`.

### Telemetria e movimento

O tratamento das atualizações fica em [`src/busTracking.js`](./src/busTracking.js). O frontend:

- descarta mensagens antigas pelo `timestamp`
- ignora leituras com precisão superior a `40m`
- ignora saltos que implicariam velocidade superior a `30m/s`
- desconsidera deslocamentos menores que `2m`
- interpola a posição entre atualizações

O componente [`src/components/BusMarker.jsx`](./src/components/BusMarker.jsx) anima a posição entre as atualizações. O ícone permanece com orientação fixa. Os limites ficam centralizados em `BUS_TRACKING_CONFIG` para calibração durante os testes em campo.

### Interface e comportamento do mapa

O fluxo principal da aplicação está em [`src/App.jsx`](./src/App.jsx), mas as responsabilidades maiores foram separadas:

- [`src/useBusLocations.js`](./src/useBusLocations.js): conexão, reconexão e mensagens WebSocket
- [`src/mapIcons.js`](./src/mapIcons.js): criação dos ícones do Leaflet
- [`src/components/PredioDrawer.jsx`](./src/components/PredioDrawer.jsx): painel inferior de detalhes
- [`src/components/BusMarker.jsx`](./src/components/BusMarker.jsx): marcador animado do ônibus
- [`src/components/Localizador.jsx`](./src/components/Localizador.jsx): localização do usuário
- [`src/components/Bussola.jsx`](./src/components/Bussola.jsx): foco em prédio selecionado
- [`src/components/CentralizadorOnibus.jsx`](./src/components/CentralizadorOnibus.jsx): foco no ônibus

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
- revisar as configurações do app rastreador antes de publicar ou instalar em produção
- evitar commit de endpoints internos, túneis temporários e chaves reais

## Observações

- a base de prédios é estática no frontend
- o WebSocket é usado exclusivamente para atualização em tempo real do ônibus
- alterações em identificadores (`id`) podem exigir revisão de busca e atalhos
- mudanças no PWA devem ser acompanhadas de revisão em `vite.config.js`

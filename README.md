# Mapa FURG

Mapa interativo do Campus Carreiros da FURG.

O projeto foi feito em React com Leaflet e Vite. A ideia é simples: mostrar os prédios no mapa, facilitar a busca por nome/sigla/atalho e abrir informações úteis de cada ponto do campus.

## Stack

- React
- Vite
- Leaflet + React Leaflet
- Tailwind CSS
- Vite PWA Plugin

## O que tem hoje

- Mapa interativo com marcadores dos prédios
- Busca por nome, sigla, aliases e termos personalizados
- Atalhos para locais mais usados
- Foco no prédio encontrado
- Geolocalização do usuário
- Drawer com detalhes do ponto selecionado
- Suporte a PWA
- Cache de tiles do OpenStreetMap

## Requisitos

- Node.js 18+
- npm

## Rodando localmente

```bash
npm install
npm run dev
```

Por padrão o Vite sobe em `http://localhost:5173`.

## Scripts

```bash
npm run dev
```

Sobe o ambiente de desenvolvimento.

```bash
npm run ws:server
```

Sobe o servidor WebSocket de localização do ônibus.

```bash
npm run dev:all
```

Sobe frontend (Vite) e WebSocket em paralelo para desenvolvimento local.

```bash
npm run build
```

Gera a build de produção em `dist/`.

```bash
npm run preview
```

Sobe a build gerada localmente para conferência.

```bash
npm run lint
```

Roda o ESLint no projeto.

## Estrutura principal

```text
src/
  App.jsx        interface principal e fluxo do mapa
  data.js        base de dados dos prédios e pontos de interesse
  buscas.js      normalização e tradução da busca
  index.css      estilos globais

public/
  ícones e assets usados pelo PWA

vite.config.js   configuração do Vite e do PWA
```

## Onde mexer para manter o projeto

### Adicionar ou editar um prédio

Os dados ficam em [src/data.js](./src/data.js).

Cada item segue essa linha:

```js
{
  id: "c3",
  nome: "C3 - Centro de Ciências Computacionais",
  lat: -32.072865,
  lng: -52.168750,
  descricao: "Núcleo de tecnologia, salas de aula e laboratórios.",
  aliases: ["computacao", "computação", "pet c3"],
  projetos: [
    { nome: "PET C3", sala: "114", link: "https://instagram.com/petc3furg" }
  ]
}
```

Campos mais importantes:

- `id`: identificador interno do ponto
- `nome`: nome exibido no mapa e no drawer
- `lat` e `lng`: coordenadas
- `descricao`: texto mostrado nos detalhes
- `aliases`: termos extras para busca
- `projetos`: lista opcional de projetos, laboratórios ou setores

### Ajustar a lógica da busca

A lógica fica em [src/buscas.js](./src/buscas.js).

Ali estão:

- normalização de texto
- traduções de termos curtos para ids ou grupos de ids
- regras específicas, como pavilhões e atalhos

Se a busca começar a ficar cheia de exceção, vale puxar mais aliases para `src/data.js` e deixar menos regra fixa no código.

### Ajustar interface e comportamento

O fluxo principal está em [src/App.jsx](./src/App.jsx).

É ali que ficam:

- campo de busca
- filtro dos prédios
- menu lateral
- foco do mapa
- abertura do drawer
- marcador de localização do usuário

## PWA

O projeto usa `vite-plugin-pwa`.

A configuração está em [vite.config.js](./vite.config.js) e inclui:

- manifesto da aplicação
- ícones do app
- atualização automática do service worker
- cache das tiles do OpenStreetMap

## Observações

- Hoje a base de dados dos prédios é estática e fica no front-end.
- O backend WebSocket foi adicionado apenas para posição em tempo real do ônibus.
- Se mudar nome de `id`, revise a busca e os atalhos do menu.
- Se adicionar assets do PWA, atualize também o `vite.config.js`.

## Rastreamento em tempo real do ônibus (WebSocket)

O projeto agora suporta posição do `interno` por WebSocket.

### Subir o servidor WebSocket

```bash
npm run ws:server
```

Por padrão, o servidor escuta em `ws://0.0.0.0:8080`.

Variáveis de ambiente suportadas:

- `PORT` (prioritário em produção)
- `WS_PORT` (default: `8080`)
- `WS_HOST` (default: `0.0.0.0`)
- `BUS_ID` (default: `interno`)
- `WS_AUTH_TOKEN` (opcional)

### Fluxo prático para desenvolvimento local (1 comando)

```bash
npm run dev:all
```

Esse comando sobe:

- Frontend Vite em `http://localhost:5173`
- Servidor WebSocket em `ws://0.0.0.0:8080`

### Formato da mensagem de localização

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

Campos obrigatórios: `type`, `lat`, `lng`.

## App Android dedicado (auto-start)

Foi adicionada a pasta [`android-bus-location`](./android-bus-location) com um app Android nativo que:

- inicia rastreamento automaticamente ao abrir
- roda em `Foreground Service`
- tenta reiniciar após reboot do aparelho
- envia payload `bus_location` no formato esperado pelo servidor

/**
 * Mapa FURG - Componente principal da aplicação.
 *
 * Responsabilidades:
 * - Renderizar mapa, marcadores e painel de detalhes.
 * - Aplicar busca de pontos do campus.
 * - Consumir atualizações do WebSocket de localização do ônibus.
 * - Controlar ações de foco (usuário e ônibus).
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import 'leaflet/dist/leaflet.css';
import { BookOpen, BusFront, LocateFixed, Menu, Search, Utensils, X } from 'lucide-react';
import { avisoInicial } from './data/aviso';
import { predios } from './data/predios';
import { normalizarTextoBusca, traduzirBusca } from './utils/buscas';
import { criarIconeCluster, criarIconeOnibusAoVivo, criarIconePredio } from './utils/mapIcons';
import { calcularOpacidadeOnibus } from './services/busTracking';
import {
  formatarTempoDecorrido,
  ID_PONTO_ONIBUS,
  obterConfigOnibus,
  obterOnibusPrincipal,
  POSICAO_INICIAL_ONIBUS,
  STATUS_WS,
} from './data/onibus';
import { normalizarWsUrl, useBusLocations } from './hooks/useBusLocations';
import logoPet from './assets/logos/logopetvetorizado.svg';
import { Bussola } from './components/map/Bussola';
import { BusMarker } from './components/map/BusMarker';
import { CentralizadorOnibus } from './components/map/CentralizadorOnibus';
import { Localizador } from './components/map/Localizador';
import { AvisoInicial } from './components/ui/AvisoInicial';
import { PredioDrawer } from './components/ui/PredioDrawer';
import { StatusOnibus } from './components/ui/StatusOnibus';

function App() {
  // Estados principais de interface e dados em tempo real.
  const [busca, setBusca] = useState('');
  const [solicitarGps, setSolicitarGps] = useState(0);
  const [solicitarOnibus, setSolicitarOnibus] = useState(0);
  const [predioAberto, setPredioAberto] = useState(null);
  const [menuAberto, setMenuAberto] = useState(false);
  const [agoraMs, setAgoraMs] = useState(0);
  const [feedbackGps, setFeedbackGps] = useState(null);
  const [avisoAberto, setAvisoAberto] = useState(() =>
    Boolean(avisoInicial.ativo && avisoInicial.mensagem?.trim())
  );
  const pontoInterno = useMemo(
    () => predios.find((predio) => predio.id === ID_PONTO_ONIBUS) ?? null,
    []
  );

  const wsUrl = useMemo(() => {
    // Em produção, prioriza URL configurada via variável de ambiente.
    if (import.meta.env.VITE_WS_URL) {
      const urlNormalizada = normalizarWsUrl(import.meta.env.VITE_WS_URL);
      return urlNormalizada;
    }
    const protocolo = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    return `${protocolo}//${window.location.hostname}:8080`;
  }, []);
  const { onibusPorId, statusWs } = useBusLocations(wsUrl);

  useEffect(() => {
    // Atualiza relógio local para o texto "Última: há Xs".
    const intervalo = window.setInterval(() => {
      setAgoraMs(Date.now());
    }, 1000);
    return () => window.clearInterval(intervalo);
  }, []);

  useEffect(() => {
    if (!feedbackGps || feedbackGps.tipo === 'buscando') return undefined;

    const timeout = window.setTimeout(() => {
      setFeedbackGps(null);
    }, 2800);

    return () => window.clearTimeout(timeout);
  }, [feedbackGps]);

  const mostrarFeedbackGps = useCallback((tipo, texto) => {
    setFeedbackGps({ tipo, texto });
  }, []);

  const handleGpsCentralizado = useCallback(() => {
    mostrarFeedbackGps('sucesso', 'Localização centralizada');
  }, [mostrarFeedbackGps]);

  const handleGpsErro = useCallback(() => {
    mostrarFeedbackGps('erro', 'Permissão de localização bloqueada ou indisponível');
  }, [mostrarFeedbackGps]);

  useEffect(() => {
    // Permite fechar o drawer com o botão "voltar" do navegador.
    if (predioAberto) {
      window.history.pushState({ drawerOpen: true }, "");
    }
    const handlePopState = () => {
      if (predioAberto) {
        setPredioAberto(null);
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [predioAberto]);

  const selecionarItemCurado = (id) => {
    // Abre ponto pré-definido do menu lateral.
    const predio = predios.find(p => p.id === id);
    if (predio) {
      setPredioAberto(predio);
      setMenuAberto(false); 
      setBusca(''); 
    }
  };

  const { idsExtras, termosBusca } = useMemo(() => traduzirBusca(busca), [busca]);

  // Aplica busca textual + atalhos semânticos definidos em buscas.js.
  const prediosFiltrados = useMemo(() => {
    if (!busca.trim()) return predios;

    const consulta = normalizarTextoBusca(busca);
    const consultaNumericaCurta = /^\d{1,3}$/.test(consulta);
    const calcularRelevancia = (predio) => {
      const nome = normalizarTextoBusca(predio.nome);
      const id = normalizarTextoBusca(predio.id);
      const aliases = (predio.aliases ?? []).map(normalizarTextoBusca);
      const projetos = (predio.projetos ?? []).map((projeto) =>
        normalizarTextoBusca(typeof projeto === 'string' ? projeto : projeto.nome ?? '')
      );
      const camposBuscaveis = [nome, id, ...aliases, ...projetos].filter(Boolean);

      if (consultaNumericaCurta) {
        const bateEmPrefixoNumerico = camposBuscaveis.some((campo) =>
          campo.split(/\s+/).some((token) => /^\d+$/.test(token) && token.startsWith(consulta))
        );

        return bateEmPrefixoNumerico ? 70 : 0;
      }

      if (idsExtras.includes(predio.id)) return 120;
      if (id === consulta) return 110;
      if (nome === consulta) return 100;
      if (id.startsWith(consulta)) return 90;
      if (nome.startsWith(consulta)) return 80;
      if (aliases.some((alias) => alias === consulta || alias.startsWith(consulta))) return 70;
      if (nome.includes(consulta)) return 55;
      if (aliases.some((alias) => alias.includes(consulta))) return 45;
      if (projetos.some((projeto) => projeto.startsWith(consulta))) return 38;
      if (projetos.some((projeto) => projeto.includes(consulta))) return 30;

      const bateEmTermo = termosBusca.some((termo) =>
        camposBuscaveis.some((campo) => campo.includes(termo))
      );

      return bateEmTermo ? 20 : 0;
    };

    return predios
      .map((predio, index) => ({
        predio,
        index,
        relevancia: calcularRelevancia(predio),
      }))
      .filter((item) => item.relevancia > 0)
      .sort((a, b) => b.relevancia - a.relevancia || a.index - b.index)
      .map((item) => item.predio);
  }, [busca, idsExtras, termosBusca]);

  const predioFocado = prediosFiltrados.length === 1 ? prediosFiltrados[0] : null;
  const predioAbertoAtual = predioAberto
    ? predios.find((predio) => predio.id === predioAberto.id) ?? predioAberto
    : null;
  const buscaAtiva = Boolean(busca.trim());
  const totalResultadosBusca = prediosFiltrados.length;
  const rotuloResultadosBusca = totalResultadosBusca === 1
    ? '1 resultado'
    : `${totalResultadosBusca} resultados`;
  const onibusConhecidos = Object.entries(onibusPorId);
  const onibusAtivos = onibusConhecidos.filter(([, posicao]) => !posicao.disconnectedAt);
  const onibusPrincipal = obterOnibusPrincipal(onibusPorId);
  const ultimaAtualizacao = formatarTempoDecorrido(onibusPrincipal.timestamp, agoraMs);
  const statusOnibus = statusWs === 'conectado' && onibusConhecidos.length > 0 && onibusAtivos.length === 0
    ? 'desconectado'
    : statusWs;
  const opacidadeOnibusInicial = calcularOpacidadeOnibus(null, agoraMs);
  const menuRapido = [
    { id: 'interno', label: 'Ônibus Interno', hint: 'Ponto e horários', icon: BusFront },
    { id: 'ru_CC', label: 'RU - Centro de Conv.', hint: 'Restaurante universitário', icon: Utensils },
    { id: 'ru_Lago', label: 'RU - Lago', hint: 'Restaurante universitário', icon: Utensils },
    { id: 'sib', label: 'Biblioteca Central', hint: 'Acervo e estudos', icon: BookOpen },
  ];

  return (
    <div className="h-[100dvh] w-full relative font-sans overflow-hidden bg-[#edf3f6]">
      <AvisoInicial aviso={avisoAberto ? avisoInicial : null} onClose={() => setAvisoAberto(false)} />

      
      {menuAberto && (
        <div 
          onClick={() => setMenuAberto(false)} 
          className="absolute inset-0 bg-furg-navy/25 z-[11000] backdrop-blur-sm transition-opacity duration-300"
        ></div>
      )}

      <div 
        className={`absolute left-0 top-0 bottom-0 w-[min(86vw,310px)] bg-white z-[12000] border-r border-slate-200 shadow-2xl transition-transform duration-300 ease-out flex flex-col ${menuAberto ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex-grow overflow-y-auto p-5 pt-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="mb-6 flex items-center justify-between border-b border-slate-200 pb-4">
            <div>
              <span className="block text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
                Mapa FURG
              </span>
              <h3 className="mt-1 text-xl font-black text-furg-navy">Acesso rápido</h3>
            </div>
            <button
              type="button"
              onClick={() => setMenuAberto(false)}
              className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-600 transition-all duration-200 hover:bg-slate-200 hover:text-slate-900 active:scale-95"
              aria-label="Fechar menu"
            >
              <X size={19} strokeWidth={2.5} aria-hidden="true" />
            </button>
          </div>
          
          <ul key={menuAberto ? 'menu-open' : 'menu-closed'} className="space-y-2.5">
            {menuRapido.map((item, index) => {
              const Icone = item.icon;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => selecionarItemCurado(item.id)}
                    className="animate-menu-item group flex min-h-16 w-full items-center gap-3 rounded-2xl border border-slate-200/80 bg-white px-3.5 py-3 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-furg-navy/25 hover:shadow-md active:translate-y-px active:scale-[0.99]"
                    style={{ animationDelay: `${70 + index * 38}ms` }}
                  >
                    <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-furg-navy/10 text-furg-navy transition-colors group-hover:bg-furg-navy group-hover:text-white">
                      <Icone size={20} strokeWidth={2.25} aria-hidden="true" />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-black text-slate-800">
                        {item.label}
                      </span>
                      <span className="mt-0.5 block truncate text-[11px] font-semibold text-slate-500">
                        {item.hint}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div className="absolute left-3 right-3 top-3 z-[9999] sm:left-4 sm:right-4 md:left-1/2 md:-translate-x-1/2 md:max-w-[520px]">
        <div className="animate-panel-in flex flex-row items-center gap-2 rounded-2xl border border-white/80 bg-white/94 p-2 shadow-[0_10px_30px_rgba(0,51,102,0.16)] backdrop-blur-md sm:gap-2.5">
          
          <button 
            type="button"
            onClick={() => setMenuAberto(true)}
            className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-slate-100 text-furg-navy transition-all duration-200 hover:bg-slate-200 active:scale-95"
            aria-label="Abrir menu de acesso rapido"
          >
            <Menu size={22} strokeWidth={2.35} aria-hidden="true" />
          </button>

          <div className="hidden flex-row items-center gap-2 pl-0.5 min-[390px]:flex">
            <a href="https://petc3.vercel.app/" target="_blank" rel="noopener noreferrer" className="cursor-pointer block">
              <img src={logoPet} alt="Logo PET C3" className="h-10 w-10 object-contain transition-transform duration-300 hover:scale-110 sm:h-12 sm:w-12" onError={(e) => { e.target.style.display = 'none'; }} />
            </a>
          </div>
          <div className="hidden h-8 w-px bg-slate-300/70 min-[390px]:block" /> 
          <div className="relative flex-grow">
            <Search
              size={17}
              strokeWidth={2.35}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
              aria-hidden="true"
            />
            <input 
              type="text" 
              placeholder="Buscar prédio..." 
              aria-label="Buscar predio, sala, restaurante ou projeto"
              value={busca}
              onChange={(e) => {
                setBusca(e.target.value);
                setPredioAberto(null);
              }}
              className={`w-full rounded-xl border bg-white px-9 py-3 pr-12 text-sm font-semibold text-slate-900 outline-none transition-all duration-200 placeholder:font-medium placeholder:text-slate-500 focus:ring-2 focus:ring-furg-navy/35 ${buscaAtiva ? 'border-furg-navy/45 shadow-sm' : 'border-slate-200'}`}
            />
            {busca && (
              <button 
                type="button"
                onClick={() => setBusca('')} 
                className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-600 shadow-sm transition-all duration-200 hover:bg-white hover:text-furg-navy active:scale-95"
                aria-label="Limpar busca"
                title="Limpar busca"
              >
                <X size={15} strokeWidth={2.7} aria-hidden="true" />
              </button>
            )}
            {buscaAtiva && (
              <div className="animate-panel-in absolute left-0 right-0 top-[calc(100%+8px)] rounded-2xl border border-slate-200 bg-white px-3 py-2 text-[12px] font-bold text-slate-700 shadow-[0_10px_28px_rgba(0,51,102,0.14)]">
                {totalResultadosBusca === 0 ? (
                  <div>
                    <span>Nenhum resultado encontrado.</span>
                    <span className="mt-1 block text-[11px] font-semibold text-slate-500">
                      Tente: C3, RU, Biblioteca, ônibus, sala 1101.
                    </span>
                  </div>
                ) : (
                  <span className="text-furg-navy">
                    {rotuloResultadosBusca}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="group absolute bottom-12 right-4 z-[9999] md:right-6">
        <button
          type="button"
          onClick={() => {
            mostrarFeedbackGps('buscando', 'Buscando sua localização...');
            setSolicitarGps(prev => prev + 1);
          }}
          className="bg-white p-3 w-12 h-12 flex items-center justify-center rounded-2xl border border-slate-200 shadow-[0_8px_24px_rgba(0,51,102,0.18)] active:translate-y-px active:scale-90 transition-all duration-200 text-furg-navy hover:-translate-y-1 hover:shadow-xl"
          aria-label="Minha localização"
          title="Minha localização"
        >
          <LocateFixed size={27} strokeWidth={2.25} aria-hidden="true" />
        </button>
        <span className="pointer-events-none absolute right-14 top-1/2 hidden -translate-y-1/2 translate-x-1 whitespace-nowrap rounded-lg bg-slate-900/90 px-2.5 py-1.5 text-[11px] font-bold text-white opacity-0 shadow-lg transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100 md:block">
          Minha localização
        </span>
      </div>

      {feedbackGps && (
        <div
          className="pointer-events-none absolute left-4 right-4 top-24 z-[10001] flex justify-center"
          aria-live="polite"
        >
          <div
            className={`animate-soft-pop rounded-2xl border px-3.5 py-2 text-xs font-bold shadow-lg backdrop-blur-xl ${
              feedbackGps.tipo === 'erro'
                ? 'border-amber-100 bg-amber-50/95 text-amber-800'
                : 'border-white/70 bg-white/95 text-furg-navy'
            }`}
          >
            {feedbackGps.texto}
          </div>
        </div>
      )}

      <div className="group absolute bottom-28 right-4 z-[9999] md:right-6">
        <button
          type="button"
          onClick={() => setSolicitarOnibus(prev => prev + 1)}
          className="bg-white p-3 w-12 h-12 flex items-center justify-center rounded-2xl border border-slate-200 shadow-[0_8px_24px_rgba(0,51,102,0.18)] active:translate-y-px active:scale-90 transition-all duration-200 text-furg-navy hover:-translate-y-1 hover:shadow-xl"
          aria-label="Centralizar ônibus"
          title="Centralizar ônibus"
        >
          <BusFront size={27} strokeWidth={2.25} aria-hidden="true" />
        </button>
        <span className="pointer-events-none absolute right-14 top-1/2 hidden -translate-y-1/2 translate-x-1 whitespace-nowrap rounded-lg bg-slate-900/90 px-2.5 py-1.5 text-[11px] font-bold text-white opacity-0 shadow-lg transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100 md:block">
          Centralizar ônibus
        </span>
      </div>

      <StatusOnibus
        status={statusOnibus}
        statusLabel={STATUS_WS[statusOnibus]}
        quantidadeAtivos={onibusAtivos.length}
        ultimaAtualizacao={ultimaAtualizacao}
      />

      <PredioDrawer
        predio={predioAbertoAtual}
        onClose={() => setPredioAberto(null)}
        statusOnibus={STATUS_WS[statusOnibus]}
        onibusPrincipal={onibusPrincipal}
        ultimaAtualizacao={ultimaAtualizacao}
      />
      
      <MapContainer 
      // Centro inicial do campus.
        center={[-32.0732, -52.1651]} 
        zoom={16} 
        minZoom={15} // Impede que a câmera afaste o suficiente para ver o vazio além das bordas
        className="h-full w-full z-0"
        zoomControl={false} 
      >
        <TileLayer 
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
          attribution='&copy; OpenStreetMap | © PET Ciências Computacionais – FURG' 
        />
        
        <Bussola alvo={predioAbertoAtual || predioFocado} />
        <Localizador
          focar={solicitarGps}
          onCentralizado={handleGpsCentralizado}
          onErro={handleGpsErro}
        />
        <CentralizadorOnibus focar={solicitarOnibus} posicao={onibusPrincipal} />

        <MarkerClusterGroup
          chunkedLoading
          iconCreateFunction={criarIconeCluster}
          maxClusterRadius={40}
        >
          {prediosFiltrados.map((predio) => (
            <Marker 
              key={predio.id} 
              position={[predio.lat, predio.lng]} 
              icon={criarIconePredio(predio.id, {
                destacado: buscaAtiva,
                selecionado: predioAbertoAtual?.id === predio.id,
              })}
              zIndexOffset={predioAbertoAtual?.id === predio.id ? 1200 : buscaAtiva ? 800 : 0}
              eventHandlers={{
                click: () => setPredioAberto(predio),
              }}
            />
          ))}
        </MarkerClusterGroup>

        {onibusConhecidos.length === 0 ? (
          <Marker
            position={[POSICAO_INICIAL_ONIBUS.lat, POSICAO_INICIAL_ONIBUS.lng]}
            icon={criarIconeOnibusAoVivo(obterConfigOnibus().icone)}
            opacity={opacidadeOnibusInicial}
            zIndexOffset={1500}
            eventHandlers={{
              click: () => {
                if (pontoInterno) {
                  setPredioAberto(pontoInterno);
                }
              },
            }}
          />
        ) : (
          onibusConhecidos.map(([busId, posicao]) => (
            <BusMarker
              key={busId}
              posicao={posicao}
              config={obterConfigOnibus(busId)}
              opacity={calcularOpacidadeOnibus(posicao.timestamp, agoraMs)}
              onClick={() => {
                if (pontoInterno) {
                  setPredioAberto(pontoInterno);
                }
              }}
            />
          ))
        )}

      </MapContainer>
    </div>
  );
}

export default App;


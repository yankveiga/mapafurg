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
import { BusFront, LocateFixed } from 'lucide-react';
import { avisoInicial } from './data/aviso';
import { predios } from './data/predios';
import { normalizarTextoBusca, traduzirBusca } from './utils/buscas';
import { criarIconeCluster, criarIconeOnibusAoVivo, criarIconePredio } from './utils/mapIcons';
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
  const onibusAtivos = Object.entries(onibusPorId);
  const onibusPrincipal = obterOnibusPrincipal(onibusPorId);
  const ultimaAtualizacao = formatarTempoDecorrido(onibusPrincipal.timestamp, agoraMs);

  return (
    <div className="h-[100dvh] w-full relative font-sans overflow-hidden bg-slate-50">
      <AvisoInicial aviso={avisoAberto ? avisoInicial : null} onClose={() => setAvisoAberto(false)} />

      
      {menuAberto && (
        <div 
          onClick={() => setMenuAberto(false)} 
          className="absolute inset-0 bg-black/20 z-[11000] backdrop-blur-sm"
        ></div>
      )}

      <div 
        className={`absolute left-0 top-0 bottom-0 w-[280px] bg-white/95 backdrop-blur-2xl z-[12000] border-r border-white/50 shadow-2xl transition-transform duration-300 ease-out flex flex-col ${menuAberto ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="p-6 pt-10 flex-grow overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex justify-between items-center mb-8 border-b border-slate-200 pb-4">
            <h3 className="text-xl font-black text-[#003366]">Acesso Rápido</h3>
            <button
              type="button"
              onClick={() => setMenuAberto(false)}
              className="flex h-11 w-11 items-center justify-center rounded-full text-2xl font-bold text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800"
              aria-label="Fechar menu"
            >
              ✕
            </button>
          </div>
          
          <ul className="space-y-3">
            <li>
              <button onClick={() => selecionarItemCurado('interno')} className="flex items-center gap-4 w-full text-left p-3 rounded-xl hover:bg-slate-100 transition-colors">
                <span className="text-2xl">🚌</span>
                <span className="text-sm font-bold text-slate-800">Ônibus Interno</span>
              </button>
            </li>
            <li>
              <button onClick={() => selecionarItemCurado('ru_CC')} className="flex items-center gap-4 w-full text-left p-3 rounded-xl hover:bg-slate-100 transition-colors">
                <span className="text-2xl">🍴</span>
                <span className="text-sm font-bold text-slate-800">RU - Centro de Conv.</span>
              </button>
            </li>
            <li>
              <button onClick={() => selecionarItemCurado('ru_Lago')} className="flex items-center gap-4 w-full text-left p-3 rounded-xl hover:bg-slate-100 transition-colors">
                <span className="text-2xl">🍽️</span>
                <span className="text-sm font-bold text-slate-800">RU - Lago</span>
              </button>
            </li>
                        <li>
              <button onClick={() => selecionarItemCurado('sib')} className="flex items-center gap-4 w-full text-left p-3 rounded-xl hover:bg-slate-100 transition-colors">
                <span className="text-2xl">📚</span>
                <span className="text-sm font-bold text-slate-800">Biblioteca Central</span>
              </button>
            </li>
          </ul>
        </div>
      </div>

      <div className="absolute top-4 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:max-w-[480px] z-[9999]">
        <div className="flex flex-row items-center gap-3 p-2.5 bg-white/50 backdrop-blur-xl shadow-lg rounded-2xl border border-white/60">
          
          <button 
            type="button"
            onClick={() => setMenuAberto(true)}
            className="w-11 h-11 flex-shrink-0 flex items-center justify-center rounded-xl bg-white/50 hover:bg-white/70 text-[#003366] text-2xl active:scale-95 transition-all"
            aria-label="Abrir menu de acesso rapido"
          >
            ☰
          </button>

          <div className="flex flex-row items-center gap-2 pl-1">
            <a href="https://petc3.vercel.app/" target="_blank" rel="noopener noreferrer" className="cursor-pointer block">
              <img src={logoPet} alt="Logo PET C3" className="w-14 h-14 object-contain scale-110 hover:scale-125 transition-transform duration-300" onError={(e) => { e.target.style.display = 'none'; }} />
            </a>
          </div>
          <div className="h-8 w-px bg-slate-300/50" /> 
          <div className="relative flex-grow">
            <input 
              type="text" 
              placeholder="Buscar prédio..." 
              aria-label="Buscar predio, sala, restaurante ou projeto"
              value={busca}
              onChange={(e) => {
                setBusca(e.target.value);
                setPredioAberto(null);
              }}
              className={`w-full bg-white/50 hover:bg-white/70 text-slate-900 px-3 py-3 pr-20 rounded-xl border outline-none focus:ring-2 focus:ring-[#003366]/40 transition-all duration-200 text-sm ${buscaAtiva ? 'border-[#003366]/40 shadow-sm' : 'border-white/60'}`}
            />
            {busca && (
              <button 
                type="button"
                onClick={() => setBusca('')} 
                className="absolute right-2 top-1/2 min-h-8 -translate-y-1/2 rounded-full bg-white/85 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-slate-700 shadow-sm transition-colors hover:bg-white hover:text-slate-900 active:scale-95"
                aria-label="Limpar busca"
                title="Limpar busca"
              >
                Limpar
              </button>
            )}
            {buscaAtiva && (
              <div className="absolute left-0 right-0 top-[calc(100%+8px)] rounded-2xl border border-white/70 bg-white/95 px-3 py-2 text-[12px] font-bold text-slate-700 shadow-lg backdrop-blur-xl">
                {totalResultadosBusca === 0 ? (
                  <div>
                    <span>Nenhum resultado encontrado.</span>
                    <span className="mt-1 block text-[11px] font-semibold text-slate-500">
                      Tente: C3, RU, Biblioteca, ônibus, sala 1101.
                    </span>
                  </div>
                ) : (
                  <span className="text-[#003366]">
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
          className="bg-white/65 backdrop-blur-xl p-3 w-12 h-12 flex items-center justify-center rounded-2xl border border-white/80 shadow-lg active:scale-90 transition-all duration-200 text-[#003366] hover:-translate-y-1 hover:bg-white/90 hover:shadow-xl"
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
            className={`rounded-2xl border px-3.5 py-2 text-xs font-bold shadow-lg backdrop-blur-xl ${
              feedbackGps.tipo === 'erro'
                ? 'border-amber-100 bg-amber-50/95 text-amber-800'
                : 'border-white/70 bg-white/95 text-[#003366]'
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
          className="bg-white/65 backdrop-blur-xl p-3 w-12 h-12 flex items-center justify-center rounded-2xl border border-white/80 shadow-lg active:scale-90 transition-all duration-200 text-[#003366] hover:-translate-y-1 hover:bg-white/90 hover:shadow-xl"
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
        status={statusWs}
        statusLabel={STATUS_WS[statusWs]}
        quantidadeAtivos={onibusAtivos.length}
        ultimaAtualizacao={ultimaAtualizacao}
      />

      <PredioDrawer
        predio={predioAbertoAtual}
        onClose={() => setPredioAberto(null)}
        statusOnibus={STATUS_WS[statusWs]}
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
              icon={criarIconePredio(predio.id)}
              eventHandlers={{
                click: () => setPredioAberto(predio),
              }}
            />
          ))}
        </MarkerClusterGroup>

        {onibusAtivos.length === 0 ? (
          <Marker
            position={[POSICAO_INICIAL_ONIBUS.lat, POSICAO_INICIAL_ONIBUS.lng]}
            icon={criarIconeOnibusAoVivo(obterConfigOnibus().icone)}
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
          onibusAtivos.map(([busId, posicao]) => (
            <BusMarker
              key={busId}
              posicao={posicao}
              config={obterConfigOnibus(busId)}
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

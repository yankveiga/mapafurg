/**
 * Mapa FURG - Componente principal da aplicação.
 *
 * Responsabilidades:
 * - Renderizar mapa, marcadores e painel de detalhes.
 * - Aplicar busca de pontos do campus.
 * - Consumir atualizações do WebSocket de localização do ônibus.
 * - Controlar ações de foco (usuário e ônibus).
 */
import { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import 'leaflet/dist/leaflet.css';
import { BusFront, LocateFixed } from 'lucide-react';
import { normalizarTextoBusca, traduzirBusca } from './buscas';
import { predios } from './data';
import { criarIconeCluster, criarIconeOnibusAoVivo, criarIconePredio } from './mapIcons';
import {
  formatarTempoDecorrido,
  ID_PONTO_ONIBUS,
  obterConfigOnibus,
  obterOnibusPrincipal,
  POSICAO_INICIAL_ONIBUS,
  STATUS_WS,
} from './onibus';
import { normalizarWsUrl, useBusLocations } from './useBusLocations';
import logoPet from './assets/logopetvetorizado.svg';
import { Bussola } from './components/Bussola';
import { BusMarker } from './components/BusMarker';
import { CentralizadorOnibus } from './components/CentralizadorOnibus';
import { Localizador } from './components/Localizador';
import { PredioDrawer } from './components/PredioDrawer';

function App() {
  // Estados principais de interface e dados em tempo real.
  const [busca, setBusca] = useState('');
  const [solicitarGps, setSolicitarGps] = useState(0);
  const [solicitarOnibus, setSolicitarOnibus] = useState(0);
  const [predioAberto, setPredioAberto] = useState(null);
  const [menuAberto, setMenuAberto] = useState(false);
  const [agoraMs, setAgoraMs] = useState(0);
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

    return predios.filter((p) => {
      if (idsExtras.includes(p.id)) return true;

      const camposBuscaveis = [
        p.nome,
        p.id,
        ...(p.aliases ?? []),
        ...((p.projetos ?? []).map((projeto) =>
          typeof projeto === 'string' ? projeto : projeto.nome ?? ''
        )),
      ]
        .map(normalizarTextoBusca)
        .filter(Boolean);

      return termosBusca.some((termo) =>
        camposBuscaveis.some((campo) => new RegExp(`\\b${termo}`).test(campo))
      );
    });
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
            <button onClick={() => setMenuAberto(false)} className="text-slate-400 hover:text-slate-800 font-bold text-2xl">✕</button>
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
            onClick={() => setMenuAberto(true)}
            className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-xl bg-white/40 hover:bg-white/60 text-[#003366] text-2xl active:scale-95 transition-all"
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
              value={busca}
              onChange={(e) => {
                setBusca(e.target.value);
                setPredioAberto(null);
              }}
              className={`w-full bg-white/40 hover:bg-white/60 text-slate-800 px-3 py-2.5 pr-8 rounded-xl border outline-none focus:ring-2 focus:ring-[#003366]/40 transition-all duration-200 text-sm ${buscaAtiva ? 'border-[#003366]/30 shadow-sm' : 'border-white/50'}`}
            />
            {busca && (
              <button 
                onClick={() => setBusca('')} 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800 font-bold p-1 rounded-full transition-all duration-200 hover:bg-white/70 hover:rotate-90 active:scale-90"
                aria-label="Limpar busca"
                title="Limpar busca"
              >
                &#x2715;
              </button>
            )}
            <div
              className={`pointer-events-none absolute left-1 top-[calc(100%+8px)] rounded-full border border-white/70 bg-white/80 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-[#003366] shadow-md backdrop-blur-xl transition-all duration-200 ${buscaAtiva ? 'translate-y-0 opacity-100' : '-translate-y-1 opacity-0'}`}
            >
              {totalResultadosBusca === 0 ? 'Nenhum resultado' : rotuloResultadosBusca}
            </div>
          </div>
        </div>
      </div>

      <div className="group absolute bottom-12 right-6 z-[9999]">
        <button
          onClick={() => setSolicitarGps(prev => prev + 1)}
          className="bg-white/55 backdrop-blur-xl p-3 w-12 h-12 flex items-center justify-center rounded-2xl border border-white/70 shadow-lg active:scale-90 transition-all duration-200 text-[#003366] hover:-translate-y-1 hover:bg-white/80 hover:shadow-xl"
          aria-label="Minha localização"
          title="Minha localização"
        >
          <LocateFixed size={27} strokeWidth={2.25} aria-hidden="true" />
        </button>
        <span className="pointer-events-none absolute right-14 top-1/2 hidden -translate-y-1/2 translate-x-1 whitespace-nowrap rounded-lg bg-slate-900/90 px-2.5 py-1.5 text-[11px] font-bold text-white opacity-0 shadow-lg transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100 md:block">
          Minha localização
        </span>
      </div>

      <div className="group absolute bottom-28 right-6 z-[9999]">
        <button
          onClick={() => setSolicitarOnibus(prev => prev + 1)}
          className="bg-white/55 backdrop-blur-xl p-3 w-12 h-12 flex items-center justify-center rounded-2xl border border-white/70 shadow-lg active:scale-90 transition-all duration-200 text-[#003366] hover:-translate-y-1 hover:bg-white/80 hover:shadow-xl"
          aria-label="Centralizar ônibus"
          title="Centralizar ônibus"
        >
          <BusFront size={27} strokeWidth={2.25} aria-hidden="true" />
        </button>
        <span className="pointer-events-none absolute right-14 top-1/2 hidden -translate-y-1/2 translate-x-1 whitespace-nowrap rounded-lg bg-slate-900/90 px-2.5 py-1.5 text-[11px] font-bold text-white opacity-0 shadow-lg transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100 md:block">
          Centralizar ônibus
        </span>
      </div>

      <div className="absolute bottom-12 left-6 z-[9999] px-3 py-2 rounded-xl bg-white/70 backdrop-blur-xl border border-white/60 text-[11px] font-bold text-slate-700 shadow-lg">
        Ônibus: {STATUS_WS[statusWs]} • Ativos: {onibusAtivos.length} • Última: {ultimaAtualizacao}
      </div>

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
        <Localizador focar={solicitarGps} />
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

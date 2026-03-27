import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import { predios } from './data';
import logoPet from './assets/logopetvetorizado.svg';

function Localizador({ focar }) {
  const [posicao, setPosicao] = useState(null);
  const map = useMap();

  useMapEvents({
    locationfound(e) {
      setPosicao(e.latlng);
      if (focar) {
        map.flyTo(e.latlng, 18);
      }
    },
  });

  useEffect(() => {
    if (focar) {
      map.locate({ setView: false, enableHighAccuracy: true });
    }
  }, [focar, map]);
    
  return posicao === null ? null : (
    <Marker position={posicao} icon={L.divIcon({
      className: 'bg-transparent',
      html: `<div class="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-[0_0_15px_rgba(59,130,246,0.8)] animate-pulse"></div>`,
      iconSize: [16, 16],
      iconAnchor: [8, 8],
    })} zIndexOffset={1000} />
  );
}

function Bussola({ alvo }) {
  const map = useMap();
  useEffect(() => {
    if (alvo) {
      map.flyTo([alvo.lat - 0.0005, alvo.lng], 17, { animate: true, duration: 1.2 });
    }
  }, [alvo, map]);
  return null; 
}

const criarIcone = (sigla) => {
  const tamanhoFonte = sigla.length > 4 ? 'text-[7px]' : 'text-[10px]';
  return L.divIcon({
    className: 'bg-transparent',
    html: `<div class="bg-[#003366] text-white font-bold ${tamanhoFonte} rounded-full border-2 border-white shadow-md px-2 min-w-[40px] h-6 flex items-center justify-center whitespace-nowrap -translate-x-1/2 -translate-y-1/2">${sigla.toUpperCase()}</div>`,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });
};

function App() {
  const [busca, setBusca] = useState('');
  const [solicitarGps, setSolicitarGps] = useState(0);
  const [predioAberto, setPredioAberto] = useState(null);
  
  // Controle de abertura da barra lateral (Hambúrguer)
  const [menuAberto, setMenuAberto] = useState(false);

  useEffect(() => {
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

  // Lógica para abrir locais direto pelo menu lateral
  const selecionarItemCurado = (id) => {
    const predio = predios.find(p => p.id === id);
    if (predio) {
      setPredioAberto(predio);
      setMenuAberto(false); 
      setBusca(''); 
    }
  };

  const limitesCampus = [
    [-32.0950, -52.1850], 
    [-32.0500, -52.1400]  
  ];

  const removerAcentos = (str) => {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  };

  const buscaLimpa = removerAcentos(busca.toLowerCase());

  const prediosFiltrados = predios.filter((p) => 
    removerAcentos(p.nome.toLowerCase()).includes(buscaLimpa) || 
    removerAcentos(p.id.toLowerCase()).includes(buscaLimpa)
  );

  const predioFocado = prediosFiltrados.length === 1 ? prediosFiltrados[0] : null;

  return (
    <div className="h-[100dvh] w-full relative font-sans overflow-hidden bg-slate-50">
      
      {/* ------------------------------------------------------------------------
          Overlay do Menu (Camada escura para fechar clicando fora)
          ------------------------------------------------------------------------ */}
      {menuAberto && (
        <div 
          onClick={() => setMenuAberto(false)} 
          className="absolute inset-0 bg-black/20 z-[11000] backdrop-blur-sm"
        ></div>
      )}

      {/* ------------------------------------------------------------------------
          Menu Lateral (Sidebar)
          ------------------------------------------------------------------------ */}
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

      {/* Busca com Hambúrguer Embutido */}
      <div className="absolute top-4 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:max-w-[480px] z-[9999]">
        <div className="flex flex-row items-center gap-3 p-2.5 bg-white/50 backdrop-blur-xl shadow-lg rounded-2xl border border-white/60">
          
          <button 
            onClick={() => setMenuAberto(true)}
            className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-xl bg-white/40 hover:bg-white/60 text-[#003366] text-2xl active:scale-95 transition-all"
          >
            ☰
          </button>

          <div className="flex flex-row items-center gap-2 pl-1">
            {/* O Portal foi inserido aqui */}
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
              className="w-full bg-white/40 hover:bg-white/60 text-slate-800 px-3 py-2.5 pr-8 rounded-xl border border-white/50 outline-none focus:ring-2 focus:ring-[#003366]/40 transition-all text-sm"
            />
            {busca && (
              <button 
                onClick={() => setBusca('')} 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800 font-bold p-1"
              >
                &#x2715;
              </button>
            )}
          </div>
        </div>
      </div>

      {/* GPS Original */}
      <button 
        onClick={() => setSolicitarGps(prev => prev + 1)}
        className="absolute bottom-12 right-6 z-[9999] bg-white/50 backdrop-blur-xl p-4 w-12 h-12 flex items-center justify-center rounded-2xl border border-white/60 shadow-lg active:scale-95 transition-all"
      >
        <div className="w-5 h-5 border-2 border-[#003366] rounded-full flex items-center justify-center relative">
          <div className="w-1.5 h-1.5 bg-[#003366] rounded-full"></div>
          <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-0.5 h-1.5 bg-[#003366]"></div>
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0.5 h-1.5 bg-[#003366]"></div>
          <div className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-1.5 h-0.5 bg-[#003366]"></div>
          <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-1.5 h-0.5 bg-[#003366]"></div>
        </div>
      </button>

      {/* Gaveta Original */}
      <div 
        className={`absolute bottom-0 left-0 right-0 md:left-1/2 md:-translate-x-1/2 md:max-w-[480px] z-[10000] bg-white/90 backdrop-blur-2xl border-t border-white/60 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.15)] transition-transform duration-300 ease-out flex flex-col max-h-[85vh] ${predioAberto ? 'translate-y-0' : 'translate-y-full'}`}
      >
        {predioAberto && (
          <div className="p-6 pb-8 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex justify-between items-start mb-4">
              <div className="pr-4">
                <h2 className="text-xl font-black text-[#003366] leading-tight">{predioAberto.nome}</h2>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{predioAberto.id}</span>
              </div>
              <button 
                onClick={() => setPredioAberto(null)}
                className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors font-bold"
              >
                &#x2715;
              </button>
            </div>
            
            <p className="text-sm text-slate-600 mb-5 leading-relaxed whitespace-pre-wrap">{predioAberto.descricao}</p>
            {predioAberto.projetos && (
              <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-100 mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-base">📋</span>
                  <p className="font-bold text-[#003366] text-[11px] uppercase tracking-wider">Projetos & Laboratórios</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {predioAberto.projetos.map((projeto, index) => (
                    <div key={index} className="bg-white border border-slate-200 px-3 py-2 rounded-xl shadow-sm flex flex-col hover:border-[#003366]/30 transition-colors">
                      <span className="text-[11px] font-black text-[#003366] leading-none">
                        {projeto.nome || projeto}
                      </span>
                      {projeto.sala && (
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1.5 leading-none">
                          {projeto.sala}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {predioAberto.horarios && (
              <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-100 mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-base">🕒</span>
                  <p className="font-bold text-[#003366] text-[11px] uppercase tracking-wider">Horário de Funcionamento</p>
                </div>
                <div className="space-y-2.5">
                  {Object.entries(predioAberto.horarios).map(([dia, hora]) => (
                    <div key={dia} className="flex justify-between border-b border-slate-200/50 pb-2 last:border-0 last:pb-0">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wide">{dia}</span>
                      <span className="text-xs font-medium text-slate-700 leading-snug">{hora}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {predioAberto.interno && (
              <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-100 mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-base">🚌</span>
                  <p className="font-bold text-[#003366] text-[11px] uppercase tracking-wider">Horários de Partida</p>
                </div>
                <div className="space-y-2.5">
                  {Object.entries(predioAberto.interno).map(([turno, horarios]) => (
                    <div key={turno} className="flex flex-col border-b border-slate-200/50 pb-2 last:border-0 last:pb-0">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wide">{turno}</span>
                      <span className="text-xs font-medium text-slate-700 leading-snug">{horarios}</span>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-[9px] text-slate-400 font-medium italic text-center">
                  Horários sujeitos a atrasos de acordo com o trânsito do campus.
                </p>
              </div>
            )}
            
            {predioAberto.cardapio && (
              <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-100">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-base">🍴</span>
                  <p className="font-bold text-[#003366] text-[11px] uppercase tracking-wider">Cardápio da Semana</p>
                </div>
                <div className="space-y-2.5">
                  {Object.entries(predioAberto.cardapio).map(([dia, prato]) => (
                    <div key={dia} className="flex flex-col border-b border-slate-200/50 pb-2 last:border-0 last:pb-0">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wide">{dia}</span>
                      <span className="text-xs font-medium text-slate-700 leading-snug">{prato}</span>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-[9px] text-slate-400 font-medium italic text-center">
                  Atualizado presencialmente toda segunda às 07:45
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <MapContainer 
        center={[-32.0732, -52.1651]} 
        zoom={16} 
        minZoom={14} 
        maxBounds={limitesCampus} 
        maxBoundsViscosity={1.0} 
        className="h-full w-full z-0"
        zoomControl={false} 
      >
        <TileLayer 
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
          attribution='&copy; OpenStreetMap | © PET Ciências Computacionais – FURG' 
        />
        
        <Bussola alvo={predioAberto || predioFocado} />
        <Localizador focar={solicitarGps} />

        {prediosFiltrados.map((predio) => (
          <Marker 
            key={predio.id} 
            position={[predio.lat, predio.lng]} 
            icon={criarIcone(predio.id)}
            eventHandlers={{
              click: () => setPredioAberto(predio),
            }}
          />
        ))}
      </MapContainer>
    </div>
  );
}

export default App;
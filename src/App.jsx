import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Base de dados local
import { predios } from './data';

// Logotipo. Para alterar, substitua o arquivo em src/assets/
import logoPet from './assets/logopet.png'; 

// ==============================================================================
// 1. Rastreamento de Geolocalização
// ==============================================================================
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
      map.locate();
    }
  }, [focar, map]);

  return posicao === null ? null : (
    <Marker position={posicao} icon={L.divIcon({
      className: 'bg-transparent',
      html: `<div class="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-[0_0_15px_rgba(59,130,246,0.8)] animate-pulse"></div>`,
      iconSize: [16, 16],
      iconAnchor: [8, 8],
    })} />
  );
}

// ==============================================================================
// 2. Controlador de Câmera
// ==============================================================================
function Bussola({ alvo }) {
  const map = useMap();
  useEffect(() => {
    if (alvo) {
      // Offset de -0.0005 na latitude joga o pino um pouco para cima na tela,
      // evitando que ele fique escondido atrás da gaveta inferior.
      map.flyTo([alvo.lat - 0.0005, alvo.lng], 17, { animate: true, duration: 1.2 });
    }
  }, [alvo, map]);
  return null; 
}

// ==============================================================================
// 3. Renderização de Marcadores Customizados
// ==============================================================================
const criarIcone = (sigla) => {
  // Lógica para diminuir tamanho da letra se a sigla não couber
  const tamanhoFonte = sigla.length > 4 ? 'text-[7px]' : 'text-[10px]';

  return L.divIcon({
    className: 'bg-transparent',
    html: `<div class="bg-[#003366] text-white font-bold ${tamanhoFonte} rounded-full border-2 border-white shadow-md px-2 min-w-[40px] h-6 flex items-center justify-center whitespace-nowrap -translate-x-1/2 -translate-y-1/2">${sigla.toUpperCase()}</div>`,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });
};

// ==============================================================================
// 4. Estrutura Principal da Interface
// ==============================================================================
function App() {
  const [busca, setBusca] = useState('');
  const [solicitarGps, setSolicitarGps] = useState(0);
  
  // NOVO: Estado para controlar qual prédio aparece na gaveta
  const [predioAberto, setPredioAberto] = useState(null);

  const limitesCampus = [
    [-32.0950, -52.1850], 
    [-32.0500, -52.1400]  
  ];

  const prediosFiltrados = predios.filter((p) => 
    p.nome.toLowerCase().includes(busca.toLowerCase()) || 
    p.id.toLowerCase().includes(busca.toLowerCase())
  );

  const predioFocado = prediosFiltrados.length === 1 ? prediosFiltrados[0] : null;

  return (
    <div className="h-screen w-full relative font-sans overflow-hidden bg-slate-50">
      
      {/* ------------------------------------------------------------------------
          Cabeçalho e Barra de Busca
          ------------------------------------------------------------------------ */}
      <div className="absolute top-4 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:max-w-[480px] z-[1000]">
        <div className="flex flex-row items-center gap-3 p-2.5 bg-white/50 backdrop-blur-xl shadow-lg rounded-2xl border border-white/60">
          
          <div className="flex flex-row items-center gap-2 pl-1">
            <img src={logoPet} alt="Logo PET C3" className="w-14 h-14 object-contain scale-110" onError={(e) => { e.target.style.display = 'none'; }} />
            <div className="flex flex-col">
              <h1 className="text-lg font-bold text-[#003366] leading-none tracking-tight">Mapa FURG</h1>
            </div>
          </div>

          <div className="h-8 w-px bg-slate-300/50" /> 

          <div className="relative flex-grow">
            <input 
              type="text" 
              placeholder="Buscar prédio ou sigla..." 
              value={busca}
              onChange={(e) => {
                setBusca(e.target.value);
                setPredioAberto(null); // Fecha a gaveta se o usuário começar a buscar outra coisa
              }}
              className="w-full bg-white/40 hover:bg-white/60 text-slate-800 px-4 py-2.5 pr-10 rounded-xl border border-white/50 outline-none focus:ring-2 focus:ring-[#003366]/40 transition-all text-sm"
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

      {/* ------------------------------------------------------------------------
          Controle de GPS
          ------------------------------------------------------------------------ */}
      <button 
        onClick={() => setSolicitarGps(prev => prev + 1)}
        className="absolute bottom-8 right-6 z-[1000] bg-white/50 backdrop-blur-xl p-4 w-12 h-12 flex items-center justify-center rounded-2xl border border-white/60 shadow-lg active:scale-95 transition-all"
      >
        <div className="w-5 h-5 border-2 border-[#003366] rounded-full flex items-center justify-center relative">
          <div className="w-1.5 h-1.5 bg-[#003366] rounded-full"></div>
          <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-0.5 h-1.5 bg-[#003366]"></div>
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0.5 h-1.5 bg-[#003366]"></div>
          <div className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-1.5 h-0.5 bg-[#003366]"></div>
          <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-1.5 h-0.5 bg-[#003366]"></div>
        </div>
      </button>

      {/* ------------------------------------------------------------------------
          NOVO: Gaveta Inferior (Bottom Sheet)
          ------------------------------------------------------------------------ */}
      <div 
        className={`absolute bottom-0 left-0 right-0 md:left-1/2 md:-translate-x-1/2 md:max-w-[480px] z-[2000] bg-white/90 backdrop-blur-2xl border-t border-white/60 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.15)] transition-transform duration-300 ease-out flex flex-col ${predioAberto ? 'translate-y-0' : 'translate-y-full'}`}
      >
        {predioAberto && (
          <div className="p-6 pb-8">
            {/* Cabeçalho com Título e Botão Fechar (X) */}
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

            <p className="text-sm text-slate-600 mb-5 leading-relaxed">{predioAberto.descricao}</p>

            {/* Renderiza o cardápio com design focado na gaveta */}
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

      {/* ------------------------------------------------------------------------
          Instância do Leaflet (Mapa Base)
          ------------------------------------------------------------------------ */}
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
          attribution='&copy; OpenStreetMap'
        />
        
        {/* A câmera foca no prédio buscado OU no prédio clicado para a gaveta */}
        <Bussola alvo={predioAberto || predioFocado} />
        <Localizador focar={solicitarGps} />

        {prediosFiltrados.map((predio) => (
          <Marker 
            key={predio.id} 
            position={[predio.lat, predio.lng]} 
            icon={criarIcone(predio.id)}
            // Gatilho do Clique: Abre a gaveta e joga os dados para o predioAberto
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
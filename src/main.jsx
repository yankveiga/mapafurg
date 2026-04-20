/**
 * Ponto de entrada da aplicação React.
 *
 * Responsabilidades:
 * - montar o componente principal no DOM;
 * - registrar o Service Worker da PWA;
 * - forçar atualização para reduzir risco de cache desatualizado.
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Registrador de Service Worker fornecido pelo vite-plugin-pwa.
import { registerSW } from 'virtual:pwa-register'

// Atualização automática quando houver nova versão disponível.
const updateSW = registerSW({
  immediate: true,
  onNeedRefresh() {
    updateSW(true)
  },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

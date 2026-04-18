/**
 * Ponto de entrada do frontend React.
 *
 * Este arquivo:
 * - inicializa a aplicacao no elemento `#root`;
 * - registra o Service Worker da PWA;
 * - força atualizacao quando uma nova versao estiver disponivel.
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Importa o registrador do Service Worker gerado pelo Vite PWA
import { registerSW } from 'virtual:pwa-register'

// Registra o SW e aplica atualizacao automatica para evitar cache antigo.
const updateSW = registerSW({
  immediate: true,
  onNeedRefresh() {
    // Quando o plugin sinaliza nova versao, recarrega para usar arquivos atuais.
    updateSW(true)
  },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

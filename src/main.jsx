import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Importa o registrador do Service Worker gerado pelo Vite PWA
import { registerSW } from 'virtual:pwa-register'

// Registra o SW e aplica atualização automaticamente para evitar cache antigo quebrando o app.
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

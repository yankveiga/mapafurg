import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'; // A importação que mantém a sua interface viva
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // O CSS de volta ao seu devido lugar
    VitePWA({
      registerType: 'autoUpdate', // Atualiza os dados em background sem travar a tela.
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'logopet.png'], // Estáticos essenciais para o offline.
      manifest: {
        name: 'Mapa FURG',
        short_name: 'Mapa FURG',
        description: 'Mapa interativo do Campus Carreiros',
        theme_color: '#003366',
        background_color: '#f8fafc',
        display: 'standalone', // Oculta a barra do navegador, simulando um app nativo.
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'], // Faz o cache de toda a estrutura base.
        
        // Intercepta as imagens do OpenStreetMap para manter o mapa visualizável sem internet.
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/[a-c]\.tile\.openstreetmap\.org\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'osm-tiles',
              expiration: {
                maxEntries: 1000,
                maxAgeSeconds: 60 * 60 * 24 * 30 // Validade do cache: 30 dias.
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    })
  ]
});
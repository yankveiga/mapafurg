/**
 * Configuração de build do frontend.
 *
 * Plugins ativos:
 * - React (JSX/HMR)
 * - Tailwind
 * - PWA (manifesto, service worker e cache de assets/tiles)
 */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'logopet.png'],
      manifest: {
        name: 'Mapa FURG',
        short_name: 'Mapa FURG',
        description: 'Mapa interativo do Campus Carreiros',
        // Cor de tema usada na barra do navegador e no app instalado.
        theme_color: '#003366',
        // Cor da tela de abertura (splash screen) da PWA.
        background_color: '#003366',
        display: 'standalone',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            // `maskable` permite recorte seguro em launchers Android.
            purpose: 'any maskable'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/[a-c]\.tile\.openstreetmap\.org\/.*/i,
            handler: 'CacheFirst',
            options: {
              // Cache dedicado para tiles do OSM.
              cacheName: 'osm-tiles',
              expiration: {
                maxEntries: 1000,
                maxAgeSeconds: 60 * 60 * 24 * 30
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

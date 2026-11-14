import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        manifestFilename: 'manifest.json',
        includeAssets: [
          'favicon.ico',
          'icon.svg',
          'phoenix-logo.png',
          'apple-touch-icon.png',
          'pwa-192x192.png',
          'pwa-512x512.png',
          'pwa-maskable-512x512.png'
        ],
        manifest: {
          id: '/',
          name: 'PhoenixAtlas — Offline Geography & Learning Platform',
          short_name: 'PhoenixAtlas',
          description: 'Offline-first interactive geography platform, quizzes, alphabets, and flashcards.',
          theme_color: '#090d16',
          background_color: '#090d16',
          display: 'standalone',
          start_url: '/',
          scope: '/',
          icons: [
            {
              src: '/pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-maskable-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
        },
        workbox: {
          maximumFileSizeToCacheInBytes: 15 * 1024 * 1024,
          skipWaiting: true,
          clientsClaim: true,
          cleanupOutdatedCaches: true,
          globPatterns: [
            '**/*.{js,css,html,ico,png,svg,woff,woff2}',
            'data/cities.json',
            'quizzes/*.json',
            'maps/world/*.topo.json',
            'maps/offline_manifest.json'
          ],
          runtimeCaching: [
            {
              urlPattern: /\/maps\/.*\.(?:topo\.json|geojson|json)$/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'phoenix-atlas-workbox-maps-v10',
                expiration: {
                  maxEntries: 800,
                  maxAgeSeconds: 60 * 60 * 24 * 365
                },
                cacheableResponse: {
                  statuses: [0, 200]
                }
              }
            }
          ]
        },
        devOptions: {
          enabled: true,
        },
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
  };
});

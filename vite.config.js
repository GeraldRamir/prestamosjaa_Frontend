import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'logo-72.png',
        'logo-120.png',
        'logo-128.png',
        'logo-144.png',
        'logo-152.png',
        'logo-196.png', // Corregido
      ],
      injectRegister: 'auto',
      devOptions: {
        enabled: false, // Habilitar PWA también en desarrollo
      },
      workbox: {
        cacheId: 'prestamos-app-v3',
        globPatterns: [
          '**/*.{js,css,html,png,webmanifest,jsx,ico,svg}'
        ],
        maximumFileSizeToCacheInBytes: 5000000,
        runtimeCaching: [
          {
            urlPattern: /\.js$/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'js-cache',
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 60 * 24,
              },
            },
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/, // Imágenes con extensión svg
            handler: 'CacheFirst',
            options: {
              cacheName: 'image-cache',
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 60 * 24 * 30,
              },
            },
          },
          {
            urlPattern: /\.css$/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'css-cache',
              expiration: {
                maxEntries: 10,
              },
            },
          },
          {
            urlPattern: /\.html$/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'html-cache',
              expiration: {
                maxEntries: 10,
              },
            },
          },
          // Aquí agregamos la caché para las solicitudes a la API
          {
            urlPattern: /\/api\//,  // Ajusta esta URL a tu endpoint de API
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 60 * 24 * 7, // 7 días de caché
              },
            },
          },
        ],
      },
      manifest: {
        name: 'Prestamos-ja',
        short_name: 'Prestamos-ja',
        start_url: '/',
        display: 'standalone',
        background_color: '#658c78',
        theme_color: '#658c78',
        orientation: 'portrait-primary',
        icons: [
          {
            src: '/logo-72.png',
            type: 'image/png',
            sizes: '72x72',
          },
          {
            src: '/logo-120.png',
            type: 'image/png',
            sizes: '120x120',
          },
          {
            src: '/logo-128.png',
            type: 'image/png',
            sizes: '128x128',
          },
          {
            src: '/logo-144.png',
            type: 'image/png',
            sizes: '144x144',
          },
          {
            src: '/logo-152.png',
            type: 'image/png',
            sizes: '152x152',
          },
          {
            src: '/logo-196.png',
            type: 'image/png',
            sizes: '196x196',
          },
        ],
      },
      // Inyectar el archivo sw.js personalizado
      inject: {
        sw: '/sw.js', // Ruta del service worker personalizado dentro de la carpeta public
      },
    }),
  ],
  build: {
    sourcemap: true,
  },
  server: {
    sourcemap: true,
  },
});

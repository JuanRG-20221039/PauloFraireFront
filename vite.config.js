import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      devOptions: { enabled: true },
      manifest: {
        short_name: "CRESPF",
        name: "Centro Regional de Educación Superior Paulo Freire",
        icons: [
          {
            src: "/images/logo192.png",
            type: "image/png",
            sizes: "192x192",
          },
          {
            src: "/images/logo512.png",
            type: "image/png",
            sizes: "512x512",
          },
          {
            src: "/images/logo180.png",
            type: "image/png",
            sizes: "180x180",
          },
          {
            src: "/images/logo96.png",
            type: "image/png",
            sizes: "96x96",
          },
          {
            src: "/images/logo512.svg",
            type: "image/svg+xml",
            sizes: "512x512",
          },
        ],

        id: "/?source=pwa",
        start_url: "/?source=pwa",
        background_color: "#CCE6CC",
        display: "standalone",
        scope: "/",
        theme_color: "#254C34",
        shortcuts: [
          {
            name: "Ver carreras del CRESPF",
            short_name: "Carreras",
            description:
              "Ver carreras que ofrece el Crentro Regional de Educación Superior Paulo Freire",
            url: "/educational-offer?source=pwa",
            icons: [{ src: "/images/logo192.png", sizes: "192x192" }],
          },
          {
            name: "Ver las convocatorias",
            short_name: "Convocatorias",
            description: "Ver las convocatorias vigentes del año en el CRESPF",
            url: "/calls?source=pwa",
            icons: [{ src: "/images/logo192.png", sizes: "192x192" }],
          },
        ],
        description:
          "Descarga nuestra aplicación web progresiva para acceder fácilmente a la información sobre las carreras y convocatorias del Centro Regional de Educación Superior Paulo Freire (CRESPF). Mantente actualizado con las últimas noticias y eventos relacionados con nuestra institución educativa.",
        screenshots: [
          {
            src: "/images/screenshot1.jpg",
            type: "image/jpg",
            sizes: "720x540",
            form_factor: "wide",
          },
        ],
      },
      workbox: {
        clientsClaim: true,
        skipWaiting: true,
        globPatterns: ["**/*.{js,css,html,ico,png,svg,jpg,jpeg,webp,pdf}"],
        maximumFileSizeToCacheInBytes: 30 * 1024 * 1024,
        navigateFallback: "index.html",
        navigateFallbackAllowlist: [
          /^\/$/,
          /^\/organization$/,
          /^\/educational-offer$/,
          /^\/calls$/,
          /^\/academy-activities$/,
          /^\/contexto-contemporaneo$/,
          /^\/acercade$/,
          /^\/login$/,
        ],
        runtimeCaching: [
          // Oferta Educativa: NetworkFirst (desarrollo)
          {
            urlPattern: new RegExp(
              "https?:\\/\\/[^/]+\\/api\\/(getoffter|getoffterid)"
            ),
            handler: "NetworkFirst",
            options: {
              cacheName: "api-offer-dev",
              expiration: { maxEntries: 100, maxAgeSeconds: 86400 },
              networkTimeoutSeconds: 3,
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          // General (Inicio, Convocatorias, Actividades, Análisis): StaleWhileRevalidate (desarrollo)
          {
            urlPattern: new RegExp(
              "https?:\\/\\/[^/]+\\/api\\/(getbecas|institucional|customsize|slogan|introduction|academy-activities|blog/published|logo|header-title|social-links|contexto-contemporaneo|pdfs-cc|image-activity|politicas\\/vigente|Terminos\\/vigente|deslindes\\/vigente)"
            ),
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "api-general-dev",
              expiration: { maxEntries: 150, maxAgeSeconds: 86400 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },

          // Imágenes: CacheFirst
          {
            urlPattern: new RegExp("\\.(?:png|jpg|jpeg|gif|svg|webp)$"),
            handler: "CacheFirst",
            options: {
              cacheName: "images-cache",
              expiration: { maxEntries: 200, maxAgeSeconds: 604800 },
            },
          },
          // JS y CSS dinámicos (chunks) : CacheFirst
          {
            urlPattern: new RegExp("/assets/.*\\.(?:js|css)$"),
            handler: "CacheFirst",
            options: {
              cacheName: "assets-cache",
              expiration: { maxEntries: 100, maxAgeSeconds: 604800 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          // PDFs: CacheFirst
          {
            urlPattern: new RegExp("\\.(?:pdf)$"),
            handler: "CacheFirst",
            options: {
              cacheName: "pdf-cache",
              expiration: { maxEntries: 50, maxAgeSeconds: 2592000 },
            },
          },
          // Videos: CacheFirst
          {
            urlPattern: new RegExp("\\.(?:mp4|webm|ogg)$"),
            handler: "CacheFirst",
            options: {
              cacheName: "video-cache",
              expiration: { maxEntries: 30, maxAgeSeconds: 2592000 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
});

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
            src: "/images/logo512.svg",
            type: "image/svg+xml",
            sizes: "512x512",
          },
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
        runtimeCaching: [
          {
            urlPattern: "http://localhost:8000/api/getoffter",
            handler: "NetworkFirst",
            options: {
              cacheName: "Marvinxdxd",
              expiration: { maxEntries: 50, maxAgeSeconds: 3600 },
            },
          },
        ],
      },
    }),
  ],
});

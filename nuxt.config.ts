// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  ssr: true, // Enable SSR for better performance on Vercel

  modules: [
    "@nuxtjs/tailwindcss",
    "@pinia/nuxt",
    "@vueuse/nuxt",
    "@nuxtjs/supabase",
    "@vite-pwa/nuxt",
  ],

  supabase: {
    redirect: false,
    url: process.env.NUXT_PUBLIC_SUPABASE_URL,
    key: process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY,
  },

  css: ["~/assets/css/main.css"],

  app: {
    head: {
      title: "GameShelf - Your Game Catalog",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          name: "description",
          content:
            "A mobile-first game catalog application for managing your physical game collection",
        },
        { name: "theme-color", content: "#222222" },
        { name: "apple-mobile-web-app-capable", content: "yes" },
        {
          name: "apple-mobile-web-app-status-bar-style",
          content: "black-translucent",
        },
        { name: "apple-mobile-web-app-title", content: "GameShelf" },
        { name: "mobile-web-app-capable", content: "yes" },
      ],
      link: [
        { rel: "icon", type: "image/png", href: "/icon-192x192.png" },
        { rel: "apple-touch-icon", href: "/icon-192x192.png" },
      ],
    },
  },

  runtimeConfig: {
    public: {
      openaiApiKey: process.env.OPENAI_API_KEY,
    },
  },

  pwa: {
    registerType: "autoUpdate",
    manifest: {
      name: "GameShelf - Your Game Catalog",
      short_name: "GameShelf",
      description:
        "A mobile-first game catalog application for managing your physical game collection",
      theme_color: "#222222",
      background_color: "#ffffff",
      display: "standalone",
      orientation: "portrait-primary",
      scope: "/",
      start_url: "/",
      icons: [
        {
          src: "/icon-48x48.png",
          sizes: "48x48",
          type: "image/png",
        },
        {
          src: "/icon-72x72.png",
          sizes: "72x72",
          type: "image/png",
        },
        {
          src: "/icon-96x96.png",
          sizes: "96x96",
          type: "image/png",
        },
        {
          src: "/icon-128x128.png",
          sizes: "128x128",
          type: "image/png",
        },
        {
          src: "/icon-144x144.png",
          sizes: "144x144",
          type: "image/png",
        },
        {
          src: "/icon-152x152.png",
          sizes: "152x152",
          type: "image/png",
        },
        {
          src: "/icon-192x192.png",
          sizes: "192x192",
          type: "image/png",
          purpose: "any maskable",
        },
        {
          src: "/icon-256x256.png",
          sizes: "256x256",
          type: "image/png",
        },
        {
          src: "/icon-384x384.png",
          sizes: "384x384",
          type: "image/png",
        },
        {
          src: "/icon-512x512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "any maskable",
        },
      ],
    },
    workbox: {
      navigateFallback: "/",
      globPatterns: ["**/*.{js,css,html,png,svg,ico}"],
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/.*\.supabase\.co\/.*/i,
          handler: "NetworkFirst",
          options: {
            cacheName: "supabase-cache",
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 60 * 60 * 24, // 24 hours
            },
            cacheableResponse: {
              statuses: [0, 200],
            },
          },
        },
        {
          urlPattern: /^https:\/\/api\.openai\.com\/.*/i,
          handler: "NetworkOnly",
          options: {
            cacheName: "openai-cache",
          },
        },
        {
          urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
          handler: "CacheFirst",
          options: {
            cacheName: "images-cache",
            expiration: {
              maxEntries: 100,
              maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
            },
          },
        },
      ],
    },
    client: {
      installPrompt: true,
      periodicSyncForUpdates: 20,
    },
    devOptions: {
      enabled: true,
      suppressWarnings: true,
      navigateFallback: "/",
      type: "module",
    },
  },
});

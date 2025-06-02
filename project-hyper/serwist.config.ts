import { defineConfig } from "serwist";

export default defineConfig({
  globDirectory: ".next",
  globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
  swSrc: "src/sw.ts",
  swDest: "public/sw.js",
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/fonts\.googleapis\.com/,
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "google-fonts-stylesheets",
      },
    },
  ],
});

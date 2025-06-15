import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vite.dev/config/
export default defineConfig(({ command }) => {
  const isProduction = command === "build";
  const base = isProduction ? "/Studyplan/" : "/";

  return {
    base,
    plugins: [vue()],
    resolve: {
      alias: {
        "@": "/src",
      },
    },
    server: {
      port: 3000,
      strictPort: true,
      host: true,
    },
    build: {
      outDir: "dist",
      assetsDir: "assets",
      emptyOutDir: true,
      rollupOptions: {
        output: {
          assetFileNames: (assetInfo) => {
            if (assetInfo.name === "favicon.ico") {
              return "favicon.ico";
            }
            return "assets/[name]-[hash][extname]";
          },
          chunkFileNames: "assets/[name]-[hash].js",
          entryFileNames: "assets/[name]-[hash].js",
        },
      },
    },
    publicDir: "public",
  };
});

import { defineConfig } from "vite";

export default defineConfig({
  build: {
    outDir: "dist",
    manifest: true,
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: "resources/js/main.js",
      },
    },
  },
});

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
    strictPort: true,
    proxy: {
      "/rooms": {
        target: "https://fastapi-project-78pm.onrender.com",
        changeOrigin: true,
      },
      "/run": {
        target: "https://fastapi-project-78pm.onrender.com",
        changeOrigin: true,
      },
      "/ws": {
        target: "wss://fastapi-project-78pm.onrender.com",
        ws: true,
        changeOrigin: true,
      },
      "/autocomplete": {
        target: "https://fastapi-project-78pm.onrender.com",
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
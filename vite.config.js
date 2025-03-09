import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  base: "/",
  build: {
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: true,
    rollupOptions: {
      external: ["react-icons/fa", "react-icons/fa6"],
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          icons: ["react-icons"],
        },
      },
    },
  },
});

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

const DEFAULT_PORT = 3000;

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  server: {
    port: DEFAULT_PORT,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes("node_modules/react/") || id.includes("node_modules/react-dom/") || id.includes("node_modules/react-router-dom/")) {
            return "@react-vendor";
          }
        },
      },
    },
  },
});

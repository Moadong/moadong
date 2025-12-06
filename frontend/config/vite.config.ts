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
          if (id.includes('node_modules')) {
            if (
              id.includes('@tanstack/react-query') ||
              id.includes('date-fns') ||
              id.includes('framer-motion') ||
              id.includes('zustand')
            ) {
              return '@libs-vendor';
            }

            return 'vendor';
          }
        },
      },
    },
  },
});

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

const DEFAULT_PORT = 3000;

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  server: {
    port: DEFAULT_PORT,
  },
});

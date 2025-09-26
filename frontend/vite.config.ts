import { defineConfig } from 'vite';
import vike from 'vike/plugin';
import { fileURLToPath } from 'node:url';
import { URL } from 'node:url';
import react from '@vitejs/plugin-react';

export default defineConfig(async () => {
  return {
    build: {},
    plugins: [react(), vike()],
    ssr: { noExternal: ['styled-components'] },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
      dedupe: ['styled-components'],
    },
  };
});

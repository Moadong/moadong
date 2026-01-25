import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

const DEFAULT_PORT = 3000;

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return;

          if (id.includes('react-router')) return 'router';
          if (id.includes('react-datepicker')) return 'dates';
          if (
            id.includes('react-markdown') ||
            id.includes('remark') ||
            id.includes('rehype') ||
            id.includes('unified') ||
            id.includes('micromark') ||
            id.includes('mdast') ||
            id.includes('hast') ||
            id.includes('parse5')
          ) {
            return 'markdown';
          }

          if (
            id.includes('node_modules/react/') ||
            id.includes('node_modules/react-dom/') ||
            id.includes('scheduler')
          ) {
            return 'react-vendor';
          }

          if (id.includes('zustand')) return 'state';
          if (id.includes('@tanstack/react-query')) return 'react-query';

          if (id.includes('mixpanel-browser')) return 'analytics';
          if (id.includes('@sentry')) return 'sentry';

          if (id.includes('framer-motion') || id.includes('motion-dom'))
            return 'motion';
          if (id.includes('swiper')) return 'swiper';
          if (id.includes('date-fns')) return 'dates';

          return 'vendor';
        },
      },
    },
  },
  server: {
    port: DEFAULT_PORT,
  },
});

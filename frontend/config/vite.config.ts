import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { visualizer } from 'rollup-plugin-visualizer';

const DEFAULT_PORT = 3000;

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true,
      filename: 'dist/stats.html',
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          const n = id.replace(/\\/g, "/");
          if (!n.includes("/node_modules/")) return;

          if (n.includes("/node_modules/react-router")) return "router";
          if (n.includes("/node_modules/react-datepicker")) return "dates";
          if (
            n.includes("/node_modules/react-markdown/") ||
            n.includes("/node_modules/remark-") ||
            n.includes("/node_modules/rehype-") ||
            n.includes("/node_modules/unified/") ||
            n.includes("/node_modules/micromark") ||
            n.includes("/node_modules/mdast-") ||
            n.includes("/node_modules/hast-") ||
            n.includes("/node_modules/parse5/")
          ) {
            return "markdown";
          }

          if (
            n.includes("/node_modules/react/") ||
            n.includes("/node_modules/react-dom/") ||
            n.includes("/node_modules/scheduler/")
          ) {
            return "react-vendor";
          }

          if (
            n.includes("/node_modules/zustand/") ||
            n.includes("/node_modules/@tanstack/react-query/")
          ) {
            return "state";
          }

          if (
            n.includes("/node_modules/mixpanel-browser/") ||
            n.includes("/node_modules/@sentry/")
          ) {
            return "analytics";
          }

          if (n.includes("/node_modules/framer-motion/") || n.includes("/node_modules/motion-dom/")) return "motion";
          if (n.includes("/node_modules/swiper/")) return "swiper";
          if (n.includes("/node_modules/date-fns/")) return "dates";

          return "vendor";
        },
      },
    },
  },
  server: {
    port: DEFAULT_PORT,
  },
});

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
          if (!id.includes("node_modules")) return;

          // 1. react-* 패키지들 (react 보다 먼저 체크해야 함)
          if (id.includes("react-router")) return "router";
          if (id.includes("react-datepicker")) return "dates";
          if (
            id.includes("react-markdown") ||
            id.includes("remark") ||
            id.includes("rehype") ||
            id.includes("unified") ||
            id.includes("micromark") ||
            id.includes("mdast") ||
            id.includes("hast") ||
            id.includes("parse5")
          ) {
            return "markdown";
          }

          // 2. Core React (위에서 react-* 패키지들을 먼저 걸러낸 후)
          if (
            id.includes("node_modules/react/") ||
            id.includes("node_modules/react-dom/") ||
            id.includes("scheduler")
          ) {
            return "react-vendor";
          }

          // 3. 상태 관리 & 데이터 페칭
          if (id.includes("zustand")) return "state";
          if (id.includes("@tanstack/react-query")) return "react-query";

          // 4. 분석 & 모니터링
          if (id.includes("mixpanel-browser")) return "analytics";
          if (id.includes("@channel.io")) return "channel";
          if (id.includes("@sentry")) return "sentry";

          // 5. UI 라이브러리
          if (id.includes("framer-motion") || id.includes("motion-dom")) return "motion";
          if (id.includes("swiper")) return "swiper";
          if (id.includes("date-fns")) return "dates";

          return "vendor";
        },
      },
    },
  },
  server: {
    port: DEFAULT_PORT,
  },
});

import { sentryVitePlugin } from '@sentry/vite-plugin';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';

const DEFAULT_PORT = 3000;

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  const isProduction = mode === 'production';

  if (isProduction && (!env.SENTRY_AUTH_TOKEN || !env.VITE_SENTRY_RELEASE)) {
    throw new Error(
      'Missing SENTRY_AUTH_TOKEN or VITE_SENTRY_RELEASE for production sourcemap upload.',
    );
  }

  return {
    plugins: [
      react(),
      tsconfigPaths(),
      svgr(),
      ...(isProduction
        ? [
            sentryVitePlugin({
              org: 'moadong',
              project: 'moadong',
              authToken: env.SENTRY_AUTH_TOKEN,
              release: {
                name: env.VITE_SENTRY_RELEASE,
              },
              sourcemaps: {
                filesToDeleteAfterUpload: [
                  './**/*.map',
                  './**/public/**/*.map',
                  './dist/**/*.map',
                ],
              },
            }),
          ]
        : []),
    ],
    build: {
      sourcemap: isProduction ? 'hidden' : false,
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
  };
});

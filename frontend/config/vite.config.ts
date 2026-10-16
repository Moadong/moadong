import { sentryVitePlugin } from '@sentry/vite-plugin';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';

const DEFAULT_PORT = 3000;

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  const isProduction = mode === 'production';
  const canUploadSentrySourcemaps =
    isProduction && !!env.SENTRY_AUTH_TOKEN && !!env.VITE_SENTRY_RELEASE;

  if (isProduction && !canUploadSentrySourcemaps) {
    console.warn(
      '[sentry-vite-plugin] Missing SENTRY_AUTH_TOKEN or VITE_SENTRY_RELEASE. Skipping sourcemap upload.',
    );
  }

  return {
    define: {
      __VERCEL_PREVIEW__: process.env.VERCEL_ENV === 'preview',
      // Vercel이 빌드마다 자동 주입하는 커밋 SHA. 쿼리 캐시 buster로 사용.
      __BUILD_ID__: JSON.stringify(process.env.VERCEL_GIT_COMMIT_SHA ?? ''),
    },
    plugins: [
      react({
        babel: {
          plugins: [
            ['babel-plugin-react-compiler', {}],
            // agentation 툴바가 DOM 클래스에서 styled 변수명을 읽을 수 있게 한다.
            // fileName: true — `Container`처럼 흔한 이름(72곳)을 파일명으로 구분한다.
            [
              'babel-plugin-styled-components',
              { displayName: true, fileName: true, ssr: false },
            ],
          ],
        },
      }),
      tsconfigPaths(),
      svgr(),
      ...(canUploadSentrySourcemaps
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
      sourcemap: canUploadSentrySourcemaps ? 'hidden' : false,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (!id.includes('node_modules')) return;

            // 디자인 피드백 툴바는 ?design=1일 때만 lazy 로드한다.
            // vendor에 묶이면 모든 사용자가 받게 되므로 자체 청크로 분리한다.
            if (id.includes('node_modules/agentation/')) return 'agentation';

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

            // 이름을 붙이지 않은 의존성은 Rollup 기본 배치에 맡긴다.
            // 여기서 'vendor'를 반환하면 지연 청크(AdminRoutes)에서만 쓰는
            // 라이브러리까지 엔트리가 참조하는 공용 청크로 끌려온다.
            return undefined;
          },
        },
      },
    },
    server: {
      port: DEFAULT_PORT,
      proxy: {
        '/api': {
          target: env.VITE_API_BASE_URL,
          changeOrigin: true,
          cookieDomainRewrite: 'localhost',
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              proxyReq.removeHeader('origin');
            });
          },
        },
        '/auth': {
          target: env.VITE_API_BASE_URL,
          changeOrigin: true,
          cookieDomainRewrite: 'localhost',
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              proxyReq.removeHeader('origin');
            });
          },
        },
      },
    },
  };
});

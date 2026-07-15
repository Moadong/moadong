import { BrowserRouter } from 'react-router-dom';
import * as Sentry from '@sentry/react';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { QueryCache, QueryClient, type Query } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { ThemeProvider } from 'styled-components';
import { ScrollToTopButton } from '@/components/common/ScrollToTopButton/ScrollToTopButton';
import { queryKeys } from '@/constants/queryKeys';
import { STORAGE_KEYS } from '@/constants/storageKeys';
import { HttpError } from '@/errors';
import { ScrollToTop } from '@/hooks/Scroll/ScrollToTop';
import AppRoutes from '@/routes/AppRoutes';
import GlobalStyles from '@/styles/Global.styles';
import { theme } from '@/styles/theme';
import WebviewGlobalStyles from '@/styles/WebviewGlobal.styles';
import isInAppWebView from '@/utils/isInAppWebView';
import { GlobalBoundary } from './components/common/ErrorBoundary';
import 'swiper/css';

const queryClient = new QueryClient({
  // 쿼리 에러는 기본적으로 바운더리로 전파되지 않으므로(throwOnError: false),
  // 전역 캐시 레벨에서 Sentry로 리포팅한다. 사용자에게 안내되는 4xx는 노이즈라 제외.
  queryCache: new QueryCache({
    onError: (error) => {
      if (error instanceof HttpError && error.isClientError()) return;
      Sentry.captureException(error);
    },
  }),
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      // 4xx는 재시도해도 결과가 같으므로 제외하고, 5xx·네트워크 오류만 최대 2회 재시도.
      retry: (failureCount, error) => {
        if (error instanceof HttpError && error.isClientError()) return false;
        return failureCount < 2;
      },
      // 지수 백오프(1s → 2s, 최대 10s)로 장애 중인 서버 부하 가중을 완화.
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10_000),
    },
    mutations: {
      retry: 0,
    },
  },
});

// 백엔드 장애로 refetch가 불가능한 상황에서도 메인페이지가 마지막 데이터를 보여주도록
// 성공한 공개 쿼리만 localStorage에 영속화한다.
const PERSISTED_QUERY_ROOTS: string[] = [
  queryKeys.club.all[0],
  queryKeys.promotion.all[0],
  queryKeys.banner.all[0],
  queryKeys.game.all[0],
];
const SUGGESTIONS_KEY_SEGMENT = queryKeys.club.suggestions('')[1];

const persister = createAsyncStoragePersister({
  storage: window.localStorage,
  key: STORAGE_KEYS.QUERY_CACHE,
});

const persistOptions = {
  persister,
  // 장애로 refetch를 못 할 때 옛 데이터를 보여줄 상한(모집상태 등 stale 노출 방지).
  maxAge: 60 * 60 * 1000,
  // 배포 버전이 바뀌면(쿼리 구조·데이터 shape 변경 가능) 옛 캐시를 폐기한다.
  buster: (import.meta.env.VITE_SENTRY_RELEASE as string | undefined) ?? '',
  dehydrateOptions: {
    // 성공한 메인 공개 데이터만 저장. 개인/인증/어드민 데이터·검색 자동완성·실패 응답은 제외.
    shouldDehydrateQuery: (query: Query) => {
      if (query.state.status !== 'success') return false;
      const [root, second] = query.queryKey as [string, string?];
      if (!PERSISTED_QUERY_ROOTS.includes(root)) return false;
      if (
        root === queryKeys.club.all[0] &&
        second === SUGGESTIONS_KEY_SEGMENT
      )
        return false;
      return true;
    },
  },
};

const App = () => {
  return (
    <>
      <GlobalStyles />
      {isInAppWebView() && <WebviewGlobalStyles />}
      <GlobalBoundary>
        <PersistQueryClientProvider
          client={queryClient}
          persistOptions={persistOptions}
        >
          <ThemeProvider theme={theme}>
            <BrowserRouter>
              <ScrollToTop />
              <ScrollToTopButton />
              <AppRoutes />
            </BrowserRouter>
          </ThemeProvider>
        </PersistQueryClientProvider>
      </GlobalBoundary>
    </>
  );
};

export default App;

import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'styled-components';
import { FloatingButtonGroup } from '@/components/common/FloatingButtonGroup/FloatingButtonGroup';
import { ScrollToTop } from '@/hooks/Scroll/ScrollToTop';
import AppRoutes from '@/routes/AppRoutes';
import GlobalStyles from '@/styles/Global.styles';
import { theme } from '@/styles/theme';
import WebviewGlobalStyles from '@/styles/WebviewGlobal.styles';
import isInAppWebView from '@/utils/isInAppWebView';
import { GlobalBoundary } from './components/common/ErrorBoundary';
import 'swiper/css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      retry: 1,
    },
    mutations: {
      retry: 0,
    },
  },
});

const App = () => {
  return (
    <>
      <GlobalStyles />
      {isInAppWebView() && <WebviewGlobalStyles />}
      <GlobalBoundary>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider theme={theme}>
            <BrowserRouter>
              <ScrollToTop />
              <FloatingButtonGroup />
              <AppRoutes />
            </BrowserRouter>
          </ThemeProvider>
        </QueryClientProvider>
      </GlobalBoundary>
    </>
  );
};

export default App;

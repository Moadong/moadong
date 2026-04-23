import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'styled-components';
import { ScrollToTopButton } from '@/components/common/ScrollToTopButton/ScrollToTopButton';
import { GlobalBoundary } from './components/common/ErrorBoundary';
import { ScrollToTop } from '@/hooks/Scroll/ScrollToTop';
import AppRoutes from '@/routes/AppRoutes';
import GlobalStyles from '@/styles/Global.styles';
import { theme } from '@/styles/theme';
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
      <GlobalBoundary>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider theme={theme}>
            <BrowserRouter>
              <ScrollToTop />
              <ScrollToTopButton />
              <AppRoutes />
            </BrowserRouter>
          </ThemeProvider>
        </QueryClientProvider>
      </GlobalBoundary>
    </>
  );
};

export default App;

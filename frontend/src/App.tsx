import { lazy } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'styled-components';
import { ScrollToTopButton } from '@/components/common/ScrollToTopButton/ScrollToTopButton';
import { AdminClubProvider } from '@/context/AdminClubContext';
import { ScrollToTop } from '@/hooks/Scroll/ScrollToTop';
import LoginTab from '@/pages/AdminPage/auth/LoginTab/LoginTab';
import PrivateRoute from '@/pages/AdminPage/auth/PrivateRoute/PrivateRoute';
import ClubDetailPage from '@/pages/ClubDetailPage/ClubDetailPage';
import MainPage from '@/pages/MainPage/MainPage';
import GlobalStyles from '@/styles/Global.styles';
import { theme } from '@/styles/theme';
import ApplicationFormPage from './pages/ApplicationFormPage/ApplicationFormPage';
import ClubUnionPage from './pages/ClubUnionPage/ClubUnionPage';
import IntroducePage from './pages/IntroducePage/IntroducePage';
import 'swiper/css';
import {
  ContentErrorBoundary,
  GlobalBoundary,
} from './components/common/ErrorBoundary';
import LegacyClubDetailPage from './pages/ClubDetailPage/LegacyClubDetailPage';
import ErrorTestPage from './pages/ErrorTestPage/ErrorTestPage';

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

const AdminRoutes = lazy(() => import('@/pages/AdminPage/AdminRoutes'));

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
              <Routes>
                <Route
                  path='/'
                  element={
                    <ContentErrorBoundary>
                      <MainPage />
                    </ContentErrorBoundary>
                  }
                />
                {/*기존 웹 & 안드로이드 url (android: v1.1.0)*/}
                <Route
                  path='/club/:clubId'
                  element={
                    <ContentErrorBoundary>
                      <LegacyClubDetailPage />
                    </ContentErrorBoundary>
                  }
                />
                {/*웹 유저에게 신규 상세페이지 보유주기 위한 임시 url*/}
                <Route
                  path='/clubDetail/:clubId'
                  element={
                    <ContentErrorBoundary>
                      <ClubDetailPage />
                    </ContentErrorBoundary>
                  }
                />
                {/*한국어핸들 */}
                <Route
                  path='/clubDetail/@:clubName'
                  element={<ClubDetailPage />}
                />
                {/*새로 빌드해서 배포할 앱 주소 url*/}
                <Route
                  path='/webview/club/:clubId'
                  element={
                    <ContentErrorBoundary>
                      <ClubDetailPage />
                    </ContentErrorBoundary>
                  }
                />
                <Route
                  path='/introduce'
                  element={
                    <ContentErrorBoundary>
                      <IntroducePage />
                    </ContentErrorBoundary>
                  }
                />
                <Route path='/admin/login' element={<LoginTab />} />
                <Route
                  path='/admin/*'
                  element={
                    <ContentErrorBoundary>
                      <AdminClubProvider>
                        <PrivateRoute>
                          <AdminRoutes />
                        </PrivateRoute>
                      </AdminClubProvider>
                    </ContentErrorBoundary>
                  }
                />
                <Route
                  path='/application/:clubId/:applicationFormId'
                  element={
                    <ContentErrorBoundary>
                      <ApplicationFormPage />
                    </ContentErrorBoundary>
                  }
                />
                <Route
                  path='/club-union'
                  element={
                    <ContentErrorBoundary>
                      <ClubUnionPage />
                    </ContentErrorBoundary>
                  }
                />
                {/* 개발 환경에서만 사용 가능한 에러 테스트 페이지 */}
                {import.meta.env.DEV && (
                  <Route path='/error-test' element={<ErrorTestPage />} />
                )}
                <Route path='*' element={<Navigate to='/' replace />} />
              </Routes>
            </BrowserRouter>
          </ThemeProvider>
        </QueryClientProvider>
      </GlobalBoundary>
    </>
  );
};

export default App;

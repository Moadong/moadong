import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'styled-components';
import { ScrollToTopButton } from '@/components/common/ScrollToTopButton/ScrollToTopButton';
import { AdminClubProvider } from '@/context/AdminClubContext';
import LoginTab from '@/pages/AdminPage/auth/LoginTab/LoginTab';
import PrivateRoute from '@/pages/AdminPage/auth/PrivateRoute/PrivateRoute';
import ClubDetailPage from '@/pages/ClubDetailPage/ClubDetailPage';
import ClubDetailPage2 from '@/pages/clubDetailPage2/ClubDetailPage2';
import MainPage from '@/pages/MainPage/MainPage';
import GlobalStyles from '@/styles/Global.styles';
import { theme } from '@/styles/theme';
import ApplicationFormPage from './pages/ApplicationFormPage/ApplicationFormPage';
import ClubUnionPage from './pages/ClubUnionPage/ClubUnionPage';
import IntroducePage from './pages/IntroducePage/IntroducePage';
import 'swiper/css';

const queryClient = new QueryClient();

const AdminRoutes = lazy(() => import('@/pages/AdminPage/AdminRoutes'));

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <GlobalStyles />
          <ScrollToTopButton />
          <Routes>
            <Route
              path='/'
              element={
                <Suspense fallback={null}>
                  <MainPage />
                </Suspense>
              }
            />
            <Route
              path='/club2/:clubId'
              element={
                <Suspense fallback={null}>
                  <ClubDetailPage2 />
                </Suspense>
              }
            />
            <Route path='/introduce' element={<IntroducePage />} />
            <Route path='/admin/login' element={<LoginTab />} />
            <Route
              path='/admin/*'
              element={
                <AdminClubProvider>
                  <PrivateRoute>
                    <AdminRoutes />
                  </PrivateRoute>
                </AdminClubProvider>
              }
            />
            <Route
              path='/application/:clubId/:applicationFormId'
              element={<ApplicationFormPage />}
            />
            <Route path='/club-union' element={<ClubUnionPage />} />
            <Route path='*' element={<Navigate to='/' replace />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;

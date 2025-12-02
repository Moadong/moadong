import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AdminClubProvider } from '@/context/AdminClubContext';
import GlobalStyles from '@/styles/Global.styles';
import MainPage from '@/pages/MainPage/MainPage';
import ClubDetailPage from '@/pages/ClubDetailPage/ClubDetailPage';
import LoginTab from '@/pages/AdminPage/auth/LoginTab/LoginTab';
import PrivateRoute from '@/pages/AdminPage/auth/PrivateRoute/PrivateRoute';
import ApplicationFormPage from './pages/ApplicationFormPage/ApplicationFormPage';
import ClubUnionPage from './pages/ClubUnionPage/ClubUnionPage';
import IntroducePage from './pages/IntroducePage/IntroducePage';
import { ScrollToTopButton } from '@/components/common/ScrollToTopButton/ScrollToTopButton';
import 'swiper/css';

const queryClient = new QueryClient();

const AdminRoutes = lazy(() => import('@/pages/AdminPage/AdminRoutes'));

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
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
            path='/club/:clubId'
            element={
              <Suspense fallback={null}>
                <ClubDetailPage />
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
    </QueryClientProvider>
  );
};

export default App;

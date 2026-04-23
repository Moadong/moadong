import { lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { ContentErrorBoundary } from '@/components/common/ErrorBoundary';
import { AdminClubProvider } from '@/context/AdminClubContext';
import LoginTab from '@/pages/AdminPage/auth/LoginTab/LoginTab';
import PrivateRoute from '@/pages/AdminPage/auth/PrivateRoute/PrivateRoute';
import ApplicationFormPage from '@/pages/ApplicationFormPage/ApplicationFormPage';
import GoogleCallbackPage from '@/pages/CallbackPage/GoogleCallbackPage';
import ClubDetailPage from '@/pages/ClubDetailPage/ClubDetailPage';
import LegacyClubDetailPage from '@/pages/ClubDetailPage/LegacyClubDetailPage';
import ClubMapPage from '@/pages/ClubMapPage/ClubMapPage';
import ClubUnionPage from '@/pages/ClubUnionPage/ClubUnionPage';
import ErrorTestPage from '@/pages/ErrorTestPage/ErrorTestPage';
import IntroductionPage from '@/pages/FestivalPage/IntroductionPage/IntroductionPage';
import IntroducePage from '@/pages/IntroducePage/IntroducePage';
import MainPage from '@/pages/MainPage/MainPage';
import PromotionDetailPage from '@/pages/PromotionPage/PromotionDetailPage';
import PromotionListPage from '@/pages/PromotionPage/PromotionListPage';
import WebviewRoutes from './WebviewRoutes';

const AdminRoutes = lazy(() => import('@/pages/AdminPage/AdminRoutes'));

const AppRoutes = () => (
  <Routes>
    {/* 일반 웹 */}
    <Route
      path='/'
      element={
        <ContentErrorBoundary>
          <MainPage />
        </ContentErrorBoundary>
      }
    />
    {/* 기존 웹 & 안드로이드 url (android: v1.1.0) */}
    <Route
      path='/club/:clubId'
      element={
        <ContentErrorBoundary>
          <LegacyClubDetailPage />
        </ContentErrorBoundary>
      }
    />
    {/* 웹 유저에게 신규 상세페이지 보여주기 위한 임시 url */}
    <Route
      path='/clubDetail/:clubId'
      element={
        <ContentErrorBoundary>
          <ClubDetailPage />
        </ContentErrorBoundary>
      }
    />
    <Route
      path='/clubDetail/:clubId/map'
      element={
        <ContentErrorBoundary>
          <ClubMapPage />
        </ContentErrorBoundary>
      }
    />
    <Route
      path='/clubDetail/@:clubName'
      element={
        <ContentErrorBoundary>
          <ClubDetailPage />
        </ContentErrorBoundary>
      }
    />
    <Route
      path='/clubDetail/@:clubName/map'
      element={
        <ContentErrorBoundary>
          <ClubMapPage />
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
    <Route
      path='/club-union'
      element={
        <ContentErrorBoundary>
          <ClubUnionPage />
        </ContentErrorBoundary>
      }
    />
    <Route
      path='/festival-introduction'
      element={
        <ContentErrorBoundary>
          <IntroductionPage />
        </ContentErrorBoundary>
      }
    />
    <Route
      path='/promotions'
      element={
        <ContentErrorBoundary>
          <PromotionListPage />
        </ContentErrorBoundary>
      }
    />
    <Route
      path='/promotions/:promotionId'
      element={
        <ContentErrorBoundary>
          <PromotionDetailPage />
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

    {/* 인증 */}
    <Route path='/callback/google' element={<GoogleCallbackPage />} />
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

    {/* 웹뷰 */}
    <WebviewRoutes />

    {/* 개발 환경 전용 */}
    {import.meta.env.DEV && (
      <Route path='/error-test' element={<ErrorTestPage />} />
    )}

    <Route path='*' element={<Navigate to='/' replace />} />
  </Routes>
);

export default AppRoutes;

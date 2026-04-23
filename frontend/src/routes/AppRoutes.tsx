import { lazy } from 'react';
import { Navigate, useRoutes } from 'react-router-dom';
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
import GamePage from '@/pages/GamePage/GamePage';
import PromotionDetailPage from '@/pages/PromotionPage/PromotionDetailPage';
import PromotionListPage from '@/pages/PromotionPage/PromotionListPage';
import webviewRoutes from './webviewRoutes';

const AdminRoutes = lazy(() => import('@/pages/AdminPage/AdminRoutes'));

const AppRoutes = () =>
  useRoutes([
    /* 일반 웹 */
    {
      path: '/',
      element: (
        <ContentErrorBoundary>
          <MainPage />
        </ContentErrorBoundary>
      ),
    },
    /* 기존 웹 & 안드로이드 url (android: v1.1.0) */
    {
      path: '/club/:clubId',
      element: (
        <ContentErrorBoundary>
          <LegacyClubDetailPage />
        </ContentErrorBoundary>
      ),
    },
    /* 웹 유저에게 신규 상세페이지 보여주기 위한 임시 url */
    {
      path: '/clubDetail/:clubId',
      element: (
        <ContentErrorBoundary>
          <ClubDetailPage />
        </ContentErrorBoundary>
      ),
    },
    {
      path: '/clubDetail/:clubId/map',
      element: (
        <ContentErrorBoundary>
          <ClubMapPage />
        </ContentErrorBoundary>
      ),
    },
    {
      path: '/clubDetail/@:clubName',
      element: (
        <ContentErrorBoundary>
          <ClubDetailPage />
        </ContentErrorBoundary>
      ),
    },
    {
      path: '/clubDetail/@:clubName/map',
      element: (
        <ContentErrorBoundary>
          <ClubMapPage />
        </ContentErrorBoundary>
      ),
    },
    {
      path: '/introduce',
      element: (
        <ContentErrorBoundary>
          <IntroducePage />
        </ContentErrorBoundary>
      ),
    },
    {
      path: '/club-union',
      element: (
        <ContentErrorBoundary>
          <ClubUnionPage />
        </ContentErrorBoundary>
      ),
    },
    {
      path: '/festival-introduction',
      element: (
        <ContentErrorBoundary>
          <IntroductionPage />
        </ContentErrorBoundary>
      ),
    },
    {
      path: '/promotions',
      element: (
        <ContentErrorBoundary>
          <PromotionListPage />
        </ContentErrorBoundary>
      ),
    },
    {
      path: '/promotions/:promotionId',
      element: (
        <ContentErrorBoundary>
          <PromotionDetailPage />
        </ContentErrorBoundary>
      ),
    },
    {
      path: '/application/:clubId/:applicationFormId',
      element: (
        <ContentErrorBoundary>
          <ApplicationFormPage />
        </ContentErrorBoundary>
      ),
    },
    {
      path: '/game',
      element: (
        <ContentErrorBoundary>
          <GamePage />
        </ContentErrorBoundary>
      ),
    },

    /* 인증 */
    {
      path: '/callback/google',
      element: <GoogleCallbackPage />,
    },
    {
      path: '/admin/login',
      element: <LoginTab />,
    },
    {
      path: '/admin/*',
      element: (
        <ContentErrorBoundary>
          <AdminClubProvider>
            <PrivateRoute>
              <AdminRoutes />
            </PrivateRoute>
          </AdminClubProvider>
        </ContentErrorBoundary>
      ),
    },

    /* 웹뷰 */
    ...webviewRoutes,

    /* 개발 환경 전용 */
    ...(import.meta.env.DEV
      ? [{ path: '/error-test', element: <ErrorTestPage /> }]
      : []),

    { path: '*', element: <Navigate to='/' replace /> },
  ]);

export default AppRoutes;

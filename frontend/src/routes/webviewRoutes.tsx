import { RouteObject } from 'react-router-dom';
import { ContentErrorBoundary } from '@/components/common/ErrorBoundary';
import ClubDetailPage from '@/pages/ClubDetailPage/ClubDetailPage';
import ClubMapPage from '@/pages/ClubMapPage/ClubMapPage';
import PromotionListPage from '@/pages/PromotionPage/PromotionListPage';
import WebviewLayout from '@/pages/WebviewLayout/WebviewLayout';
import WebviewMainPage from '@/pages/WebviewMainPage/WebviewMainPage';

const webviewRoutes: RouteObject[] = [
  {
    path: '/webview',
    element: <WebviewLayout />,
    children: [
      {
        path: 'main',
        element: (
          <ContentErrorBoundary>
            <WebviewMainPage />
          </ContentErrorBoundary>
        ),
      },
      {
        path: 'promotions',
        element: (
          <ContentErrorBoundary>
            <PromotionListPage />
          </ContentErrorBoundary>
        ),
      },
      {
        path: 'club/:clubId',
        element: (
          <ContentErrorBoundary>
            <ClubDetailPage />
          </ContentErrorBoundary>
        ),
      },
      {
        path: 'club/:clubId/map',
        element: (
          <ContentErrorBoundary>
            <ClubMapPage />
          </ContentErrorBoundary>
        ),
      },
      {
        path: 'club/@:clubName',
        element: (
          <ContentErrorBoundary>
            <ClubDetailPage />
          </ContentErrorBoundary>
        ),
      },
      {
        path: 'club/@:clubName/map',
        element: (
          <ContentErrorBoundary>
            <ClubMapPage />
          </ContentErrorBoundary>
        ),
      },
    ],
  },
];

export default webviewRoutes;

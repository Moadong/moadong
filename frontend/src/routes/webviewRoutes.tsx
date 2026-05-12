import { RouteObject } from 'react-router-dom';
import { ContentErrorBoundary } from '@/components/common/ErrorBoundary';
import ClubDetailPage from '@/pages/ClubDetailPage/ClubDetailPage';
import ClubMapPage from '@/pages/ClubMapPage/ClubMapPage';
import WebviewLayout from '@/pages/WebviewLayout/WebviewLayout';
import { WEBVIEW_FILTER_CONFIG } from './webviewFilterConfig';

const webviewRoutes: RouteObject[] = [
  {
    path: '/webview',
    element: <WebviewLayout />,
    children: [
      ...WEBVIEW_FILTER_CONFIG.map(({ path, component: Page }) => ({
        path: path.replace('/webview/', ''),
        element: (
          <ContentErrorBoundary>
            <Page />
          </ContentErrorBoundary>
        ),
      })),
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

import { ComponentType } from 'react';
import { RouteObject } from 'react-router-dom';
import { ContentErrorBoundary } from '@/components/common/ErrorBoundary';
import ClubDetailPage from '@/pages/ClubDetailPage/ClubDetailPage';
import ClubMapPage from '@/pages/ClubMapPage/ClubMapPage';
import BuskingPage from '@/pages/FestivalPage/BuskingPage/BuskingPage';
import PromotionListPage from '@/pages/PromotionPage/PromotionListPage';
import WebviewLayout from '@/pages/WebviewLayout/WebviewLayout';
import WebviewMainPage from '@/pages/WebviewMainPage/WebviewMainPage';
import {
  WEBVIEW_FILTER_CONFIG,
  WebviewFilterPath,
} from './webviewFilterConfig';

const PAGE_MAP: Record<WebviewFilterPath, ComponentType> = {
  '/webview/main': WebviewMainPage,
  '/webview/promotions': PromotionListPage,
  '/webview/festival-busking': BuskingPage,
};

const webviewRoutes: RouteObject[] = [
  {
    path: '/webview',
    element: <WebviewLayout />,
    children: [
      ...WEBVIEW_FILTER_CONFIG.map(({ path }) => {
        const Page = PAGE_MAP[path];
        return {
          path: path.replace('/webview/', ''),
          element: (
            <ContentErrorBoundary>
              <Page />
            </ContentErrorBoundary>
          ),
        };
      }),
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

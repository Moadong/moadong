import { Route } from 'react-router-dom';
import ClubDetailPage from '@/pages/ClubDetailPage/ClubDetailPage';
import ClubMapPage from '@/pages/ClubMapPage/ClubMapPage';
import WebviewLayout from '@/pages/WebviewLayout/WebviewLayout';
import WebviewMainPage from '@/pages/WebviewMainPage/WebviewMainPage';
import PromotionListPage from '@/pages/PromotionPage/PromotionListPage';
import { ContentErrorBoundary } from '@/components/common/ErrorBoundary';

const WebviewRoutes = () => (
  <Route path='/webview' element={<WebviewLayout />}>
    <Route
      path='main'
      element={
        <ContentErrorBoundary>
          <WebviewMainPage />
        </ContentErrorBoundary>
      }
    />
    <Route
      path='promotions'
      element={
        <ContentErrorBoundary>
          <PromotionListPage />
        </ContentErrorBoundary>
      }
    />
    <Route
      path='club/:clubId'
      element={
        <ContentErrorBoundary>
          <ClubDetailPage />
        </ContentErrorBoundary>
      }
    />
    <Route
      path='club/:clubId/map'
      element={
        <ContentErrorBoundary>
          <ClubMapPage />
        </ContentErrorBoundary>
      }
    />
    <Route
      path='club/@:clubName'
      element={
        <ContentErrorBoundary>
          <ClubDetailPage />
        </ContentErrorBoundary>
      }
    />
    <Route
      path='club/@:clubName/map'
      element={
        <ContentErrorBoundary>
          <ClubMapPage />
        </ContentErrorBoundary>
      }
    />
  </Route>
);

export default WebviewRoutes;

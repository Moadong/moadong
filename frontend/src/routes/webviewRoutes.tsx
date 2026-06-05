import { Navigate, RouteObject, useParams } from 'react-router-dom';

/**
 * 구버전 네이티브 앱 호환용 리다이렉트.
 *
 * 앱은 `/webview/*` 를 진입 URL로 로드하고 `requestNavigateWebview('club/:id')`로
 * 이동하므로, 통합된 웹 경로로 영구 리다이렉트한다. 사용자 폰의 구버전 바이너리가
 * 깨지지 않도록 유지해야 한다(제거 금지).
 */
const ClubDetailRedirect = ({ map = false }: { map?: boolean }) => {
  const { clubId, clubName } = useParams<{
    clubId?: string;
    clubName?: string;
  }>();
  const slug = clubName ? `@${clubName}` : clubId;
  return <Navigate to={`/clubDetail/${slug}${map ? '/map' : ''}`} replace />;
};

const webviewRoutes: RouteObject[] = [
  { path: '/webview/main', element: <Navigate to='/' replace /> },
  { path: '/webview/promotions', element: <Navigate to='/promotions' replace /> },
  { path: '/webview/club/:clubId', element: <ClubDetailRedirect /> },
  { path: '/webview/club/:clubId/map', element: <ClubDetailRedirect map /> },
  { path: '/webview/club/@:clubName', element: <ClubDetailRedirect /> },
  { path: '/webview/club/@:clubName/map', element: <ClubDetailRedirect map /> },
];

export default webviewRoutes;

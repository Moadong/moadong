import {
  Navigate,
  RouteObject,
  useParams,
  useSearchParams,
} from 'react-router-dom';

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

// `//host`, `/\host`, `/<탭>/host`는 브라우저가 다른 오리진으로 해석하므로 오리진으로 비교한다
const isInternalPath = (path: string) =>
  path.startsWith('/') &&
  new URL(path, window.location.origin).origin === window.location.origin;

/**
 * 앱이 설치된 폰은 www.moadong.com 링크를 전부 앱이 가로채는데(유니버설·앱 링크 `/*`),
 * 앱 라우터는 `/peace` 같은 웹 전용 경로를 모른다. 앱은 `/webview/:slug?path=`를 받으면
 * path를 앱 웹뷰로 열므로, QR처럼 밖에서 여는 링크는 이 형태로 만든다.
 * 앱이 없는 브라우저에서는 같은 링크가 여기로 오므로 path로 보낸다(사이트 내부 경로만).
 */
const WebviewPathRedirect = () => {
  const [searchParams] = useSearchParams();
  const path = searchParams.get('path') ?? '';
  return <Navigate to={isInternalPath(path) ? path : '/'} replace />;
};

const webviewRoutes: RouteObject[] = [
  { path: '/webview/main', element: <Navigate to='/' replace /> },
  {
    path: '/webview/promotions',
    element: <Navigate to='/promotions' replace />,
  },
  { path: '/webview/club/:clubId', element: <ClubDetailRedirect /> },
  { path: '/webview/club/:clubId/map', element: <ClubDetailRedirect map /> },
  { path: '/webview/club/@:clubName', element: <ClubDetailRedirect /> },
  { path: '/webview/club/@:clubName/map', element: <ClubDetailRedirect map /> },
  { path: '/webview/:slug', element: <WebviewPathRedirect /> },
];

export default webviewRoutes;

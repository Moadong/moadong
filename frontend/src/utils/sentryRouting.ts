import { matchRoutes, useLocation, type Location } from 'react-router-dom';

const PRODUCTION_HOSTNAME = 'www.moadong.com';
const LOCALHOST_HOSTNAME = 'localhost';

// Sentry는 useLocation의 pathname과 matchRoutes가 돌려주는 pathname(디코딩)을 문자열로 비교해
// 라우트 이름을 정한다. 브라우저 pathname은 퍼센트 인코딩이라 한글 동아리명 URL은 이 비교에서 어긋나
// 실제 URL로 남는다. 그래서 비교에 쓰이는 location에는 디코딩한 pathname을 넘기고, 매칭은 원본
// location으로 한다(디코딩한 값으로 다시 매칭하면 '%XX'가 든 이름이 두 번 풀린다).
const decodedByOriginal = new WeakMap<Location, Location>();
const originalByDecoded = new WeakMap<Location, Location>();

// matchRoutes와 같은 방식(세그먼트별 decodeURIComponent)이어야 '&'·'+'가 든 동아리명도 맞는다.
export function decodePathname(pathname: string) {
  try {
    return pathname
      .split('/')
      .map((segment) => decodeURIComponent(segment).replace(/\//g, '%2F'))
      .join('/');
  } catch {
    return pathname;
  }
}

// Sentry가 이 값을 effect 의존성으로 쓰기 때문에 같은 location에는 같은 객체를 돌려줘야 한다
// (아니면 리렌더마다 navigation 스팬이 새로 생긴다).
export function useDecodedLocation() {
  const location = useLocation();
  let decoded = decodedByOriginal.get(location);
  if (!decoded) {
    decoded = { ...location, pathname: decodePathname(location.pathname) };
    decodedByOriginal.set(location, decoded);
    originalByDecoded.set(decoded, location);
  }
  return decoded;
}

export function matchRoutesByOriginal(
  ...[routes, location, basename]: Parameters<typeof matchRoutes>
) {
  const original =
    typeof location === 'string'
      ? undefined
      : originalByDecoded.get(location as Location);
  return matchRoutes(routes, original ?? location, basename);
}

// 빌드 MODE는 Vercel 프리뷰도 production이라 실제 접속한 도메인으로 구분한다.
// 실사용자는 moadong.com·moadong.vercel.app 모두 www로 redirect되어 여기에 도착한다.
export function getSentryEnvironment(hostname: string) {
  if (hostname === PRODUCTION_HOSTNAME) return 'production';
  if (hostname === LOCALHOST_HOSTNAME) return 'development';
  return 'preview';
}

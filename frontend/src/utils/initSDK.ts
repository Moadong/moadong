import { useEffect } from 'react';
import {
  createRoutesFromChildren,
  matchRoutes,
  useLocation,
  useNavigationType,
  type Location,
} from 'react-router-dom';
import * as ChannelService from '@channel.io/channel-web-sdk-loader';
import Clarity from '@microsoft/clarity';
import * as Sentry from '@sentry/react';
import mixpanel from 'mixpanel-browser';
import getDeviceLocale from '@/utils/getDeviceLocale';
import getIOSVersion from '@/utils/getIOSVersion';
import isInAppWebView from '@/utils/isInAppWebView';

const LOCALHOST_HOSTNAME = 'localhost';

export function initializeMixpanel() {
  if (!import.meta.env.VITE_MIXPANEL_TOKEN) {
    console.warn('믹스패널 환경변수 설정이 안 되어 있습니다.');
    return;
  }

  mixpanel.init(import.meta.env.VITE_MIXPANEL_TOKEN, {
    ignore_dnt: true,
    debug: false,
  });

  const iosVersion = getIOSVersion();
  if (iosVersion) {
    mixpanel.register({ $os_version: iosVersion });
  }

  // 외국인 유학생 등 비한국어 사용자 식별용 — 이후 모든 이벤트에 자동 포함
  const deviceLocale = getDeviceLocale();
  if (deviceLocale) {
    mixpanel.register({ device_locale: deviceLocale });
  }

  if (window.location.hostname === LOCALHOST_HOSTNAME) {
    mixpanel.disable();
  } else {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');
    if (sessionId) {
      mixpanel.identify(sessionId);

      urlParams.delete('session_id');
      const newUrl =
        window.location.pathname +
        (urlParams.toString() ? '?' + urlParams.toString() : '');
      window.history.replaceState({}, document.title, newUrl);
    }
  }
}

export function initializeClarity() {
  if (!import.meta.env.VITE_CLARITY_PROJECT_ID) {
    console.warn('Clarity 환경변수 설정이 안 되어 있습니다.');
    return;
  }

  if (import.meta.env.DEV) {
    return;
  }

  Clarity.init(import.meta.env.VITE_CLARITY_PROJECT_ID);
}

export function initializeChannelService() {
  ChannelService.loadScript();
  if (import.meta.env.VITE_CHANNEL_PLUGIN_KEY) {
    ChannelService.boot({
      pluginKey: import.meta.env.VITE_CHANNEL_PLUGIN_KEY,
    });
  }
}

// Sentry는 useLocation의 pathname(퍼센트 인코딩)과 matchRoutes가 돌려주는 pathname(디코딩)을
// 문자열로 비교해 라우트 이름을 정한다. 한글 동아리명 URL은 이 비교에서 어긋나 실제 URL로 남으므로
// 디코딩한 pathname을 넘긴다. Sentry가 이 값을 effect 의존성으로 쓰기 때문에 같은 location에는
// 같은 객체를 돌려줘야 한다(아니면 리렌더마다 navigation 스팬이 새로 생긴다).
const decodedLocations = new WeakMap<Location, Location>();

// matchRoutes와 같은 방식(세그먼트별 decodeURIComponent)이어야 '&'·'+'가 든 동아리명도 맞는다.
function decodePathname(pathname: string) {
  try {
    return pathname
      .split('/')
      .map((segment) => decodeURIComponent(segment).replace(/\//g, '%2F'))
      .join('/');
  } catch {
    return pathname;
  }
}

function useDecodedLocation() {
  const location = useLocation();
  let decoded = decodedLocations.get(location);
  if (!decoded) {
    decoded = { ...location, pathname: decodePathname(location.pathname) };
    decodedLocations.set(location, decoded);
  }
  return decoded;
}

// 빌드 MODE는 Vercel 프리뷰도 production이라 실제 접속한 도메인으로 구분한다.
// 실사용자는 moadong.com·moadong.vercel.app 모두 www로 redirect되어 여기에 도착한다.
function getSentryEnvironment() {
  const { hostname } = window.location;
  if (hostname === 'www.moadong.com') return 'production';
  if (hostname === LOCALHOST_HOSTNAME) return 'development';
  return 'preview';
}

export function initializeSentry() {
  const enableInDev = import.meta.env.VITE_ENABLE_SENTRY_IN_DEV === 'true';

  if (import.meta.env.DEV && !enableInDev) {
    console.log(
      'Sentry는 개발 환경에서 비활성화되어 있습니다. 테스트하려면 VITE_ENABLE_SENTRY_IN_DEV=true로 설정하세요.',
    );
    return;
  }

  if (!import.meta.env.VITE_SENTRY_DSN) {
    console.warn('Sentry DSN이 설정되지 않았습니다.');
    return;
  }

  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    sendDefaultPii: false,
    release: import.meta.env.VITE_SENTRY_RELEASE,
    tracesSampleRate: 0.1,
    environment: getSentryEnvironment(),
    // 트랜잭션 이름을 실제 URL이 아니라 라우트 패턴(/clubDetail/:clubId)으로 묶는다.
    integrations: [
      Sentry.reactRouterV7BrowserTracingIntegration({
        useEffect,
        useLocation: useDecodedLocation,
        useNavigationType,
        createRoutesFromChildren,
        matchRoutes,
      }),
    ],
  });

  // 웹뷰 진입(/webview/main)은 곧바로 /로 redirect되므로 라우트 이름만으로는 웹과 구분할 수 없다.
  Sentry.setTag('webview', isInAppWebView());
}

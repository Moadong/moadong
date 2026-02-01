import * as ChannelService from '@channel.io/channel-web-sdk-loader';
import * as Sentry from '@sentry/react';
import mixpanel from 'mixpanel-browser';

const LOCALHOST_HOSTNAME = 'localhost';

function mockMixpanel() {
  // e2e/CI에서 mixpanel 호출로 인한 에러를 막기 위한 mock
  const mock = mixpanel as unknown as {
    track: () => void;
    get_distinct_id: () => string | undefined;
    identify: () => void;
    disable: () => void;
  };
  mock.track = () => undefined;
  mock.get_distinct_id = () => undefined;
  mock.identify = () => undefined;
  mock.disable = () => undefined;
}

export function initializeMixpanel() {
  if (import.meta.env.VITE_DISABLE_MIXPANEL === 'true') {
    mockMixpanel();
    return;
  }

  if (!import.meta.env.VITE_MIXPANEL_TOKEN) {
    console.warn('믹스패널 환경변수 설정이 안 되어 있습니다.');
    return;
  }

  mixpanel.init(import.meta.env.VITE_MIXPANEL_TOKEN, {
    ignore_dnt: true,
    debug: false,
  });

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

export function initializeChannelService() {
  ChannelService.loadScript();
  if (import.meta.env.VITE_CHANNEL_PLUGIN_KEY) {
    ChannelService.boot({
      pluginKey: import.meta.env.VITE_CHANNEL_PLUGIN_KEY,
    });
  }
}

export function initializeSentry() {
  if (import.meta.env.NODE_ENV === 'development') {
    return;
  }

  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    sendDefaultPii: false,
    release: import.meta.env.VITE_SENTRY_RELEASE,
    tracesSampleRate: 0.1,
  });
}

export function initializeKakaoSDK() {
  if (!import.meta.env.VITE_KAKAO_JAVASCRIPT_KEY) {
    console.warn('환경변수가 설정되어 있지 않습니다.');
    return;
  }

  if (!window.Kakao) {
    console.error('카카오 SDK가 로드되지 않았습니다.');
    return;
  }

  try {
    window.Kakao.init(`${import.meta.env.VITE_KAKAO_JAVASCRIPT_KEY}`);
  } catch (error) {
    console.error('카카오 SDK 초기화에 실패했습니다:', error);
  }
}

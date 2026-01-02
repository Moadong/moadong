import * as ChannelService from '@channel.io/channel-web-sdk-loader';
import * as Sentry from '@sentry/react';
import mixpanel from 'mixpanel-browser';

export function initializeMixpanel() {
  if (import.meta.env.VITE_MIXPANEL_TOKEN) {
    mixpanel.init(import.meta.env.VITE_MIXPANEL_TOKEN, {
      ignore_dnt: true,
      debug: false,
    });
  }

  if (window.location.hostname === 'localhost') {
    mixpanel.disable();
  }

  const urlParams = new URLSearchParams(window.location.search);
  const sessionId = urlParams.get('session_id');
  if (sessionId) {
    mixpanel.identify(sessionId);
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

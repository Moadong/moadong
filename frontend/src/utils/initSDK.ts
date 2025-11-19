import mixpanel from 'mixpanel-browser';
import * as ChannelService from '@channel.io/channel-web-sdk-loader';
import * as Sentry from '@sentry/react';

export function initializeMixpanel() {
  if (process.env.REACT_APP_MIXPANEL_TOKEN) {
    mixpanel.init(process.env.REACT_APP_MIXPANEL_TOKEN, {
      ignore_dnt: true, // do not track이라는 브라우저 옵션 켜져 있어도 track
      debug: false,
    });
  }

  if (window.location.hostname === 'localhost') {
    mixpanel.disable();
  }
}

export function initializeChannelService() {
  ChannelService.loadScript();
  if (process.env.CHANNEL_PLUGIN_KEY) {
    ChannelService.boot({
      pluginKey: process.env.CHANNEL_PLUGIN_KEY,
    });
  }
}

export function initializeSentry() {
  if (process.env.NODE_ENV === 'development') {
    return;
  }

  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    sendDefaultPii: false,
    release: process.env.SENTRY_RELEASE,
    tracesSampleRate: 0.1,
  });
}

export function initializeKakaoSDK() {
  if (!process.env.KAKAO_JAVASCRIPT_KEY) {
    console.warn('환경변수가 설정되어 있지 않습니다.');
    return;
  }

  if (!window.Kakao) {
    console.error('카카오 SDK가 로드되지 않았습니다.');
    return;
  }

  try {
    window.Kakao.init(`${process.env.KAKAO_JAVASCRIPT_KEY}`);
  } catch (error) {
    console.error('카카오 SDK 초기화에 실패했습니다:', error);
  }
}

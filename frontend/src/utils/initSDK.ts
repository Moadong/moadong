import * as ChannelService from '@channel.io/channel-web-sdk-loader';
import Clarity from '@microsoft/clarity';
import * as Sentry from '@sentry/react';
import mixpanel from 'mixpanel-browser';
import getDeviceLocale from '@/utils/getDeviceLocale';
import getIOSVersion from '@/utils/getIOSVersion';

const LOCALHOST_HOSTNAME = 'localhost';

export function initializeMixpanel() {
  if (!import.meta.env.VITE_MIXPANEL_TOKEN) {
    console.warn('믹스패널 환경변수 설정이 안 되어 있습니다.');
    return;
  }

  mixpanel.init(import.meta.env.VITE_MIXPANEL_TOKEN, {
    ignore_dnt: true,
    debug: false,
    flags: true,
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
    environment: import.meta.env.MODE || 'production',
    integrations: [Sentry.browserTracingIntegration()],
  });
}

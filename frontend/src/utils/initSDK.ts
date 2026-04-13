import * as ChannelService from '@channel.io/channel-web-sdk-loader';
import * as Sentry from '@sentry/react';
import mixpanel from 'mixpanel-browser';

const LOCALHOST_HOSTNAME = 'localhost';

export function initializeMixpanel() {
  if (!import.meta.env.VITE_MIXPANEL_TOKEN) {
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
  const enableInDev = import.meta.env.VITE_ENABLE_SENTRY_IN_DEV === 'true';

  if (import.meta.env.DEV && !enableInDev) {

    return;
  }

  if (!import.meta.env.VITE_SENTRY_DSN) {
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

export function initializeKakaoSDK() {
  if (!import.meta.env.VITE_KAKAO_JAVASCRIPT_KEY) {
    return;
  }

  if (!window.Kakao) {
    return;
  }

  try {
    window.Kakao.init(`${import.meta.env.VITE_KAKAO_JAVASCRIPT_KEY}`);
  } catch {
  }
}

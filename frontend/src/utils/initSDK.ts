import mixpanel from 'mixpanel-browser';
import * as ChannelService from '@channel.io/channel-web-sdk-loader';
import * as Sentry from '@sentry/react';

export function initializeMixpanel() {
  if (process.env.REACT_APP_MIXPANEL_TOKEN) {
    mixpanel.init(process.env.REACT_APP_MIXPANEL_TOKEN, {
      ip: false,
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
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    sendDefaultPii: false,
    release: process.env.SENTRY_RELEASE,
    tracesSampleRate: 0.1,
  });
}

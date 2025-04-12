import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import mixpanel from 'mixpanel-browser';
import * as ChannelService from '@channel.io/channel-web-sdk-loader';

if (process.env.REACT_APP_MIXPANEL_TOKEN) {
  mixpanel.init(process.env.REACT_APP_MIXPANEL_TOKEN, {
    ip: false,
    debug: false,
  });
}

if (window.location.hostname === 'localhost') {
  mixpanel.disable();
}

ChannelService.loadScript();
ChannelService.boot({
  pluginKey: process.env.REACT_APP_CHANNEL_PLUGIN_KEY!,
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

root.render(<App />);

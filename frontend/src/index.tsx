import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import mixpanel from 'mixpanel-browser';

const mixpanelToken = process.env.REACT_APP_MIXPANEL_TOKEN;

if (mixpanelToken) {
  try {
    mixpanel.init(mixpanelToken, {
      ip: false,
      debug: true,
    });

    console.log('✅ Mixpanel initialized successfully!');
    mixpanel.track('App Initialized');
  } catch (error) {
    console.error('❌ Mixpanel initialization failed:', error);
  }
} else {
  console.warn('⚠️ Mixpanel token is missing.');
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

root.render(<App />);

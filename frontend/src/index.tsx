import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import mixpanel from 'mixpanel-browser';

if (process.env.REACT_APP_MIXPANEL_TOKEN) {
  mixpanel.init(process.env.REACT_APP_MIXPANEL_TOKEN, {
    ip: false,
    debug: true,
  });
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

root.render(<App />);

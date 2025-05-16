import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {
  initializeMixpanel,
  initializeChannelService,
  initializeSentry,
} from './utils/initSDK';

initializeMixpanel();
initializeChannelService();
initializeSentry();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

root.render(<App />);

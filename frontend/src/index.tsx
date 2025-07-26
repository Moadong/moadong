import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {
  initializeMixpanel,
  initializeChannelService,
  initializeSentry,
  initializeKakaoSDK,
} from './utils/initSDK';

initializeMixpanel();
initializeChannelService();
initializeSentry();
initializeKakaoSDK();

async function startApp() {
  if (process.env.NODE_ENV === 'development') {
    const { worker } = await import('./mocks/mswDevSetup');
    await worker.start({
      onUnhandledRequest: 'bypass',
    });
  }

  const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement,
  );
  root.render(<App />);
}

startApp();

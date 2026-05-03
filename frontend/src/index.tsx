import ReactDOM from 'react-dom/client';
import App from './App';
import { initializeExperiments } from './experiments/initializeExperiments';
import { initializeMixpanel, initializeSentry } from './utils/initSDK';

initializeMixpanel();
initializeSentry();
initializeExperiments();

if (import.meta.env.DEV) {
  window.navermap_authFailure = function () {
    console.error('Naver Map Error 인증 실패');
  };
}

async function startApp() {
  if (import.meta.env.DEV) {
    const { worker } = await import('./mocks/browser');
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

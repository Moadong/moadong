import ReactDOM from 'react-dom/client';
import App from './App';
import { initializeExperiments } from './experiments/initializeExperiments';
import {
  initializeClarity,
  initializeMixpanel,
  initializeSentry,
} from './utils/initSDK';

initializeMixpanel();
initializeSentry();
initializeClarity();
initializeExperiments();

if (import.meta.env.DEV) {
  window.navermap_authFailure = function () {
    console.error('Naver Map Error 인증 실패');
  };
}

async function startApp() {
  // 개발 환경에서는 기본으로 MSW를 켠다.
  // 로컬 백엔드에 직접 붙일 때만 .env.local에 VITE_ENABLE_MSW=false 로 끈다.
  if (import.meta.env.DEV && import.meta.env.VITE_ENABLE_MSW !== 'false') {
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

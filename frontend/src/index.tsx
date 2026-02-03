import ReactDOM from 'react-dom/client';
import App from './App';
import { initializeMixpanel, initializeSentry } from './utils/initSDK';

initializeMixpanel();
initializeSentry();

async function startApp() {
  const disableMsw = import.meta.env.VITE_DISABLE_MSW === 'true';
  if (import.meta.env.DEV && !disableMsw) {
    const { worker } = await import('./mocks/mswDevSetup');
    try {
      await worker.start({
        onUnhandledRequest: 'bypass',
      });
    } catch (error) {
      console.warn('[MSW] Service Worker start failed:', error);
    }
  } else if (
    import.meta.env.DEV &&
    disableMsw &&
    'serviceWorker' in navigator
  ) {
    // 남아 있는 MSW 서비스워커가 e2e 실행에 영향을 주지 않도록 정리
    const registrations = await navigator.serviceWorker.getRegistrations();
    await Promise.all(
      registrations.map((registration) => registration.unregister()),
    );
  }

  const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement,
  );
  root.render(<App />);
}

startApp();

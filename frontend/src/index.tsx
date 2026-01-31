import ReactDOM from 'react-dom/client';
import App from './App';
import { initializeMixpanel, initializeSentry } from './utils/initSDK';

initializeMixpanel();
initializeSentry();

async function startApp() {
  const disableMsw = import.meta.env.VITE_DISABLE_MSW === 'true';
  if (import.meta.env.DEV && !disableMsw) {
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

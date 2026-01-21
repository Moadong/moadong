import ReactDOM from 'react-dom/client';
import App from './App';
import { initializeMixpanel, initializeSentry } from './utils/initSDK';

initializeMixpanel();
initializeSentry();

async function startApp() {
  if (import.meta.env.DEV) {
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

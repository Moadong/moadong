import ReactDOM from 'react-dom/client';
import App from './App';
import { cleanupMainRedesignExperiment } from './utils/cleanupMainRedesignExperiment';
import {
  initializeClarity,
  initializeMixpanel,
  initializeSentry,
} from './utils/initSDK';

initializeMixpanel();
initializeSentry();
initializeClarity();
cleanupMainRedesignExperiment();

if (import.meta.env.DEV) {
  window.navermap_authFailure = function () {
    console.error('Naver Map Error 인증 실패');
  };
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);
root.render(<App />);

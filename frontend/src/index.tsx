import './instrument';
import ReactDOM from 'react-dom/client';
import App from './App';
import { cleanupMainRedesignExperiment } from './utils/cleanupMainRedesignExperiment';
import { initializeClarity, initializeMixpanel } from './utils/initSDK';

initializeMixpanel();
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

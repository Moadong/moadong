import ReactDOM from 'react-dom/client';
import App from './App';
import { runFlagDeliveryCheck } from './experiments/flagDeliveryCheck';
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
// 렌더를 막지 않는다. initializeMixpanel()의 identify 이후에 호출되어야 한다
void runFlagDeliveryCheck();

if (import.meta.env.DEV) {
  window.navermap_authFailure = function () {
    console.error('Naver Map Error 인증 실패');
  };
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);
root.render(<App />);

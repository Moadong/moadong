import { initializeSentry } from './utils/initSDK';

// Sentry.wrapUseRoutesV7는 감싸는 시점에 init이 끝나 있지 않으면 원래 useRoutes를 그대로 돌려준다.
// AppRoutes 모듈이 평가되기 전에 init하려고 index.tsx의 첫 import로 둔다.
initializeSentry();

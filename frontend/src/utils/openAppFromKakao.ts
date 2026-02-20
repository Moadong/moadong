import { APP_STORE_LINKS, detectPlatform } from './appStoreLink';

const ANDROID_PACKAGE = 'com.moadong.moadong';
const APP_HOST = 'www.moadong.com';
const IOS_SCHEME = 'moadongapp';

/**
 * 카카오톡 인앱 브라우저에서 앱을 실행하는 함수.
 * - Android: intent URL로 앱 직접 실행, 미설치 시 Play Store 이동
 * - iOS: 커스텀 스킴으로 앱 실행 시도, 미설치 시 2초 후 App Store 이동
 */
const openAppFromKakao = (path?: string) => {
  const platform = detectPlatform();
  const currentUrl = path ?? window.location.href;

  if (platform === 'Android') {
    const url = new URL(currentUrl);
    const fallback = encodeURIComponent(APP_STORE_LINKS.android);
    const intentUrl =
      `intent://${APP_HOST}${url.pathname}${url.search}${url.hash}` +
      `#Intent;scheme=https;package=${ANDROID_PACKAGE};S.browser_fallback_url=${fallback};end`;
    window.location.href = intentUrl;
    return;
  }

  const url = new URL(currentUrl);
  window.location.href = `${IOS_SCHEME}://${url.pathname}${url.search}${url.hash}`;

  const timer = setTimeout(() => {
    if (!document.hidden) {
      window.location.href = `kakaotalk://web/openExternal?url=${encodeURIComponent(APP_STORE_LINKS.iphone)}`;
    }
  }, 2000);

  document.addEventListener(
    'visibilitychange',
    () => {
      if (document.hidden) clearTimeout(timer);
    },
    { once: true },
  );
};

export default openAppFromKakao;

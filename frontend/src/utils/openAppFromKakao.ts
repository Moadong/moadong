import { APP_STORE_LINKS, detectPlatform } from './appStoreLink';

const ANDROID_PACKAGE = 'com.moadong.moadong';
const APP_HOST = 'www.moadong.com';

/**
 * 카카오톡 인앱 브라우저에서 앱을 실행하는 함수.
 * - Android: intent URL로 앱 직접 실행, 미설치 시 Play Store 이동
 * - iOS: Safari로 열어 Universal Link 트리거 (미설치 시 Smart App Banner 표시)
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
  const productionUrl = `https://${APP_HOST}${url.pathname}${url.search}${url.hash}`;
  window.location.href = `kakaotalk://web/openExternal?url=${encodeURIComponent(productionUrl)}`;
};

export default openAppFromKakao;

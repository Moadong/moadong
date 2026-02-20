import { detectPlatform } from './appStoreLink';

const ANDROID_PACKAGE = 'com.moadong.moadong';

/**
 * 카카오톡 인앱 브라우저에서 앱을 여는 함수.
 * - Android: intent URL 스킴으로 앱 실행 (미설치 시 Play Store 이동)
 * - iOS: 외부 Safari로 열어 Universal Link 트리거
 */
const openAppFromKakao = (path?: string) => {
  const platform = detectPlatform();
  const currentUrl = path ?? window.location.href;

  if (platform === 'Android') {
    const url = new URL(currentUrl);
    const intentUrl =
      `intent://${url.host}${url.pathname}${url.search}${url.hash}` +
      `#Intent;scheme=https;package=${ANDROID_PACKAGE};end`;
    window.location.href = intentUrl;
    return;
  }

  if (platform === 'iOS') {
    const safariUrl = `kakaotalk://web/openExternal?url=${encodeURIComponent(currentUrl)}`;
    window.location.href = safariUrl;
    return;
  }

  window.location.href = currentUrl;
};

export default openAppFromKakao;

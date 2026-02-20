/**
 * 카카오톡 인앱 브라우저에서 외부 브라우저로 열어 앱을 실행하는 함수.
 * - Android: Chrome으로 열어 Android App Links 트리거 (assetlinks.json 설정 필요)
 * - iOS: Safari로 열어 Universal Link 트리거 (apple-app-site-association 설정 필요)
 */
const openAppFromKakao = (path?: string) => {
  const currentUrl = path ?? window.location.href;
  const externalUrl = `kakaotalk://web/openExternal?url=${encodeURIComponent(currentUrl)}`;
  window.location.href = externalUrl;
};

export default openAppFromKakao;

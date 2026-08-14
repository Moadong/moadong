/**
 * iOS 기기인지 판별한다.
 *
 * 앱 웹뷰는 `userAgent` prop으로 UA를 통째로 교체해서 `MoadongApp/1.6.0 (iOS)` 형태로만 온다.
 * iPhone·iPad 토큰이 없으므로 앱이 넣어준 플랫폼 표기를 함께 본다.
 *
 * iPadOS 13+가 데스크톱 Mac UA를 보내는 경우는 다루지 않는다. 사파리의 desktop-class
 * browsing 동작이라 앱 웹뷰에서는 나타나지 않고, 지금 이 함수를 쓰는 곳은 웹뷰 전용이다.
 */
const isIOS = (userAgent: string = navigator.userAgent): boolean =>
  /(iPhone|iPad|iPod)/.test(userAgent) ||
  /MoadongApp\/\S+ \(iOS\)/.test(userAgent);

export default isIOS;

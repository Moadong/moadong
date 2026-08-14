/**
 * iOS 기기인지 판별한다.
 *
 * iPadOS 13+는 기본으로 데스크톱 Mac UA를 보내서 UA 문자열만으로는 맥과 구분되지 않는다.
 * 터치 지원 여부를 함께 봐야 iPad 사용자가 Android 분기로 새지 않는다.
 */
const isIOS = (
  userAgent: string = navigator.userAgent,
  maxTouchPoints: number = navigator.maxTouchPoints,
): boolean => {
  if (/(iPhone|iPad|iPod)/.test(userAgent)) return true;

  return /Macintosh/.test(userAgent) && maxTouchPoints > 1;
};

export default isIOS;

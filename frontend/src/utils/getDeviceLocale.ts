declare global {
  interface Window {
    // 앱이 웹뷰 로드 전에 주입하는 기기 언어 설정
    // Android: Locale.getDefault().toLanguageTag() → "ko-KR"
    // iOS: Locale.current.identifier → "ko_KR"
    deviceLocale?: string;
  }
}

/**
 * 기기 언어 설정을 BCP 47 형식으로 반환
 * 앱이 주입한 window.deviceLocale을 우선 사용하고, 없으면 navigator.language로 폴백
 * iOS의 "ko_KR@calendar=gregorian" 같은 형식을 "ko-KR"로 정규화해 Mixpanel 값이 갈라지지 않게 한다
 */
const getDeviceLocale = (
  rawLocale: string | undefined = window.deviceLocale,
): string | null => {
  const locale = rawLocale || navigator.language;
  if (!locale) {
    return null;
  }

  return locale.split('@')[0].replace(/_/g, '-').trim() || null;
};

export default getDeviceLocale;

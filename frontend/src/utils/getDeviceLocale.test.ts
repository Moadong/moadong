import getDeviceLocale from '@/utils/getDeviceLocale';

const mockNavigatorLanguage = (language: string) => {
  Object.defineProperty(navigator, 'language', {
    value: language,
    configurable: true,
  });
};

describe('getDeviceLocale', () => {
  beforeEach(() => {
    mockNavigatorLanguage('ko-KR');
    delete window.deviceLocale;
  });

  it('앱이 주입한 window.deviceLocale을 우선 사용한다', () => {
    window.deviceLocale = 'zh-CN';
    expect(getDeviceLocale()).toBe('zh-CN');
  });

  it('iOS 형식의 언더스코어를 하이픈으로 정규화한다', () => {
    expect(getDeviceLocale('vi_VN')).toBe('vi-VN');
  });

  it('iOS 식별자의 확장 정보를 제거한다', () => {
    expect(getDeviceLocale('ko_KR@calendar=gregorian')).toBe('ko-KR');
  });

  it('주입값이 없으면 navigator.language로 폴백한다', () => {
    mockNavigatorLanguage('en-US');
    expect(getDeviceLocale()).toBe('en-US');
  });

  it('주입값이 빈 문자열이면 navigator.language로 폴백한다', () => {
    expect(getDeviceLocale('')).toBe('ko-KR');
  });

  it('locale을 알 수 없으면 null을 반환한다', () => {
    mockNavigatorLanguage('');
    expect(getDeviceLocale()).toBeNull();
  });
});

import isIOS from '@/utils/isIOS';

describe('isIOS', () => {
  it('iPhone UA면 true를 반환한다', () => {
    const ua =
      'Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 MoadongApp/1.5.1';
    expect(isIOS(ua)).toBe(true);
  });

  it('iPad UA면 true를 반환한다', () => {
    const ua =
      'Mozilla/5.0 (iPad; CPU OS 14_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148';
    expect(isIOS(ua)).toBe(true);
  });

  it('Android는 false를 반환한다', () => {
    const ua = 'Mozilla/5.0 (Linux; Android 13; SM-S918N) AppleWebKit/537.36';
    expect(isIOS(ua)).toBe(false);
  });

  it('데스크톱 Mac은 false를 반환한다', () => {
    const ua =
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15';
    expect(isIOS(ua, 0)).toBe(false);
  });

  // iPadOS 13+는 기본으로 데스크톱 Mac UA를 보낸다. 맥과 같은 UA라 터치로만 구분된다
  it('데스크톱 UA를 보내는 iPadOS는 true를 반환한다', () => {
    const ua =
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15';
    expect(isIOS(ua, 5)).toBe(true);
  });
});

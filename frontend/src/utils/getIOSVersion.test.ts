import getIOSVersion from '@/utils/getIOSVersion';

describe('getIOSVersion', () => {
  it('iPhone UA에서 major.minor를 추출한다', () => {
    const ua =
      'Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1';
    expect(getIOSVersion(ua)).toBe('17.2');
  });

  it('iPad UA에서 버전을 추출한다', () => {
    const ua =
      'Mozilla/5.0 (iPad; CPU OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148';
    expect(getIOSVersion(ua)).toBe('14.0');
  });

  it('patch 버전이 있어도 major.minor만 반환한다', () => {
    const ua = 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_4_1 like Mac OS X)';
    expect(getIOSVersion(ua)).toBe('13.4');
  });

  it('iOS가 아니면 null을 반환한다', () => {
    const ua =
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15';
    expect(getIOSVersion(ua)).toBeNull();
  });

  it('Android는 null을 반환한다', () => {
    const ua = 'Mozilla/5.0 (Linux; Android 13; SM-S918N) AppleWebKit/537.36';
    expect(getIOSVersion(ua)).toBeNull();
  });
});

import isIOS from '@/utils/isIOS';

describe('isIOS', () => {
  // 앱은 userAgent prop으로 UA를 통째로 교체한다. 실제로 오는 값은 이 형태뿐이다.
  describe('앱 웹뷰', () => {
    it('iOS 앱 웹뷰면 true를 반환한다', () => {
      expect(isIOS('MoadongApp/1.6.0 (iOS)')).toBe(true);
    });

    it('Android 앱 웹뷰면 false를 반환한다', () => {
      expect(isIOS('MoadongApp/1.6.0 (Android)')).toBe(false);
    });
  });

  describe('브라우저', () => {
    it('iPhone UA면 true를 반환한다', () => {
      const ua =
        'Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148';
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
      expect(isIOS(ua)).toBe(false);
    });
  });
});

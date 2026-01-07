import {
  APP_STORE_LINKS,
  detectPlatform,
  getAppStoreLink,
} from './appStoreLink';

describe('appStoreLink 유틸 함수 테스트', () => {
  const originalNavigator = global.navigator;

  afterEach(() => {
    Object.defineProperty(global, 'navigator', {
      value: originalNavigator,
      writable: true,
      configurable: true,
    });
  });

  describe('detectPlatform', () => {
    it('iOS 기기를 감지한다 (iPhone)', () => {
      Object.defineProperty(global, 'navigator', {
        value: {
          userAgent:
            'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15',
        },
        writable: true,
        configurable: true,
      });

      expect(detectPlatform()).toBe('iOS');
    });

    it('iOS 기기를 감지한다 (iPad)', () => {
      Object.defineProperty(global, 'navigator', {
        value: {
          userAgent:
            'Mozilla/5.0 (iPad; CPU OS 14_0 like Mac OS X) AppleWebKit/605.1.15',
        },
        writable: true,
        configurable: true,
      });

      expect(detectPlatform()).toBe('iOS');
    });

    it('iOS 기기를 감지한다 (Macintosh)', () => {
      Object.defineProperty(global, 'navigator', {
        value: {
          userAgent:
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        },
        writable: true,
        configurable: true,
      });

      expect(detectPlatform()).toBe('iOS');
    });

    it('Android 기기를 감지한다', () => {
      Object.defineProperty(global, 'navigator', {
        value: {
          userAgent:
            'Mozilla/5.0 (Linux; Android 10; SM-G973F) AppleWebKit/537.36',
        },
        writable: true,
        configurable: true,
      });

      expect(detectPlatform()).toBe('Android');
    });

    it('기타 플랫폼을 감지한다 (Windows)', () => {
      Object.defineProperty(global, 'navigator', {
        value: {
          userAgent:
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
        writable: true,
        configurable: true,
      });

      expect(detectPlatform()).toBe('Other');
    });

    it('기타 플랫폼을 감지한다 (Linux)', () => {
      Object.defineProperty(global, 'navigator', {
        value: {
          userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
        },
        writable: true,
        configurable: true,
      });

      expect(detectPlatform()).toBe('Other');
    });
  });

  describe('getAppStoreLink', () => {
    it('iOS 기기에서 App Store 링크를 반환한다', () => {
      Object.defineProperty(global, 'navigator', {
        value: {
          userAgent:
            'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15',
        },
        writable: true,
        configurable: true,
      });

      expect(getAppStoreLink()).toBe(APP_STORE_LINKS.ios);
    });

    it('Android 기기에서 Play Store 링크를 반환한다', () => {
      Object.defineProperty(global, 'navigator', {
        value: {
          userAgent:
            'Mozilla/5.0 (Linux; Android 10; SM-G973F) AppleWebKit/537.36',
        },
        writable: true,
        configurable: true,
      });

      expect(getAppStoreLink()).toBe(APP_STORE_LINKS.android);
    });

    it('기타 플랫폼에서 기본 링크를 반환한다', () => {
      Object.defineProperty(global, 'navigator', {
        value: {
          userAgent:
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
        writable: true,
        configurable: true,
      });

      expect(getAppStoreLink()).toBe(APP_STORE_LINKS.default);
    });
  });

  describe('APP_STORE_LINKS 상수', () => {
    it('iOS 앱 스토어 링크가 올바른 형식이다', () => {
      expect(APP_STORE_LINKS.ios).toContain('itms-apps://');
      expect(APP_STORE_LINKS.ios).toContain('6755062085');
    });

    it('Android Play Store 링크가 올바른 형식이다', () => {
      expect(APP_STORE_LINKS.android).toContain('play.google.com');
      expect(APP_STORE_LINKS.android).toContain('com.moadong.moadong');
    });

    it('기본 링크가 Android 링크와 동일하다', () => {
      expect(APP_STORE_LINKS.default).toBe(APP_STORE_LINKS.android);
    });
  });
});

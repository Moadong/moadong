import {
  initializeMixpanel,
  initializeChannelService,
  initializeSentry,
  initializeKakaoSDK,
} from './initSDK';
import mixpanel from 'mixpanel-browser';
import * as ChannelService from '@channel.io/channel-web-sdk-loader';
import * as Sentry from '@sentry/react';

// Mock dependencies
jest.mock('mixpanel-browser');
jest.mock('@channel.io/channel-web-sdk-loader', () => ({
  loadScript: jest.fn(),
  boot: jest.fn(),
}));
jest.mock('@sentry/react', () => ({
  init: jest.fn(),
  browserTracingIntegration: jest.fn(),
}));

const mockImportMeta = {
  env: {} as any,
};
describe('initSDK', () => {
  const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
  const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  const originalLocation = window.location;
  const originalHistory = window.history;
  const originalKakao = window.Kakao;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleWarnSpy.mockClear();
    consoleErrorSpy.mockClear();

    // Reset window.location and window.history for each test
    Object.defineProperty(window, 'location', {
      writable: true,
      value: {
        ...originalLocation,
        hostname: 'test.com',
        search: '',
        pathname: '/',
        replace: jest.fn(),
      },
    });
    Object.defineProperty(window, 'history', {
      writable: true,
      value: {
        ...originalHistory,
        replaceState: jest.fn(),
      },
    });

    // Reset window.Kakao
    Object.defineProperty(window, 'Kakao', {
      writable: true,
      value: {
        ...originalKakao,
        init: jest.fn(),
      },
    });

    // Mock import.meta.env by default
    mockImportMeta.env = {}; // Reset env for each test
    Object.defineProperty(globalThis, 'import.meta', {
      writable: true,
      configurable: true,
      value: mockImportMeta,
    });
  });

  afterAll(() => {
    consoleWarnSpy.mockRestore();
    consoleErrorSpy.mockRestore();
    Object.defineProperty(window, 'location', {
      value: originalLocation,
      writable: true,
    });
    Object.defineProperty(window, 'history', {
      value: originalHistory,
      writable: true,
    });
    Object.defineProperty(window, 'Kakao', {
      value: originalKakao,
      writable: true,
    });
  });

  describe('initializeMixpanel', () => {
    it('VITE_MIXPANEL_TOKEN이 없으면 경고를 출력하고 초기화하지 않는다', () => {
      initializeMixpanel();
      expect(consoleWarnSpy).toHaveBeenCalledWith('믹스패널 환경변수 설정이 안 되어 있습니다.');
      expect(mixpanel.init).not.toHaveBeenCalled();
    });

    it('VITE_MIXPANEL_TOKEN이 있으면 Mixpanel을 초기화한다', () => {
      mockImportMeta.env.VITE_MIXPANEL_TOKEN = 'test_token';
      initializeMixpanel();
      expect(mixpanel.init).toHaveBeenCalledWith('test_token', {
        ignore_dnt: true,
        debug: false,
      });
    });

    it('localhost에서 Mixpanel이 비활성화된다', () => {
      mockImportMeta.env.VITE_MIXPANEL_TOKEN = 'test_token';
      Object.defineProperty(window, 'location', {
        writable: true,
        value: { ...window.location, hostname: 'localhost' },
      });
      initializeMixpanel();
      expect(mixpanel.disable).toHaveBeenCalled();
    });

    it('session_id가 있으면 identify를 호출하고 URL에서 제거한다', () => {
      mockImportMeta.env.VITE_MIXPANEL_TOKEN = 'test_token';
      Object.defineProperty(window, 'location', {
        writable: true,
        value: { ...window.location, search: '?session_id=user123&param=test' },
      });
      initializeMixpanel();
      expect(mixpanel.identify).toHaveBeenCalledWith('user123');
      expect(window.history.replaceState).toHaveBeenCalledWith({}, document.title, '?param=test');
    });

    it('session_id만 있고 다른 파라미터가 없으면 URL에서 session_id를 제거한다', () => {
      mockImportMeta.env.VITE_MIXPANEL_TOKEN = 'test_token';
      Object.defineProperty(window, 'location', {
        writable: true,
        value: { ...window.location, search: '?session_id=user123' },
      });
      initializeMixpanel();
      expect(mixpanel.identify).toHaveBeenCalledWith('user123');
      expect(window.history.replaceState).toHaveBeenCalledWith({}, document.title, '/');
    });
  });

  describe('initializeChannelService', () => {
    it('ChannelService 스크립트를 로드한다', () => {
      initializeChannelService();
      expect(ChannelService.loadScript).toHaveBeenCalledTimes(1);
    });

    it('VITE_CHANNEL_PLUGIN_KEY가 있으면 ChannelService를 부트한다', () => {
      mockImportMeta.env.VITE_CHANNEL_PLUGIN_KEY = 'test_channel_key';
      initializeChannelService();
      expect(ChannelService.boot).toHaveBeenCalledWith({
        pluginKey: 'test_channel_key',
      });
    });

    it('VITE_CHANNEL_PLUGIN_KEY가 없으면 ChannelService를 부트하지 않는다', () => {
      initializeChannelService();
      expect(ChannelService.boot).not.toHaveBeenCalled();
    });
  });

  describe('initializeSentry', () => {
    beforeEach(() => {
      mockImportMeta.env.MODE = 'production';
      mockImportMeta.env.VITE_SENTRY_RELEASE = 'v1.0.0';
    });

    it('개발 환경에서 VITE_ENABLE_SENTRY_IN_DEV가 false이면 Sentry를 초기화하지 않는다', () => {
      mockImportMeta.env.DEV = true;
      mockImportMeta.env.VITE_ENABLE_SENTRY_IN_DEV = 'false';
      initializeSentry();
      expect(console.log).toHaveBeenCalledWith(
        'Sentry는 개발 환경에서 비활성화되어 있습니다. 테스트하려면 VITE_ENABLE_SENTRY_IN_DEV=true로 설정하세요.',
      );
      expect(Sentry.init).not.toHaveBeenCalled();
    });

    it('VITE_SENTRY_DSN이 없으면 경고를 출력하고 초기화하지 않는다', () => {
      initializeSentry();
      expect(consoleWarnSpy).toHaveBeenCalledWith('Sentry DSN이 설정되지 않았습니다.');
      expect(Sentry.init).not.toHaveBeenCalled();
    });

    it('VITE_SENTRY_DSN이 있으면 Sentry를 초기화한다', () => {
      mockImportMeta.env.VITE_SENTRY_DSN = 'test_dsn';
      initializeSentry();
      expect(Sentry.init).toHaveBeenCalledWith({
        dsn: 'test_dsn',
        sendDefaultPii: false,
        release: 'v1.0.0',
        tracesSampleRate: 0.1,
        environment: 'production',
        integrations: [Sentry.browserTracingIntegration()],
      });
    });

    it('개발 환경에서 VITE_ENABLE_SENTRY_IN_DEV가 true이면 Sentry를 초기화한다', () => {
      mockImportMeta.env.DEV = true;
      mockImportMeta.env.VITE_ENABLE_SENTRY_IN_DEV = 'true';
      mockImportMeta.env.VITE_SENTRY_DSN = 'test_dsn';
      initializeSentry();
      expect(Sentry.init).toHaveBeenCalled();
    });
  });

  describe('initializeKakaoSDK', () => {
    it('VITE_KAKAO_JAVASCRIPT_KEY가 없으면 경고를 출력하고 초기화하지 않는다', () => {
      initializeKakaoSDK();
      expect(consoleWarnSpy).toHaveBeenCalledWith('환경변수가 설정되어 있지 않습니다.');
      expect(window.Kakao.init).not.toHaveBeenCalled();
    });

    it('window.Kakao가 없으면 에러를 출력하고 초기화하지 않는다', () => {
      mockImportMeta.env.VITE_KAKAO_JAVASCRIPT_KEY = 'test_kakao_key';
      Object.defineProperty(window, 'Kakao', {
        writable: true,
        value: undefined,
      });
      initializeKakaoSDK();
      expect(consoleErrorSpy).toHaveBeenCalledWith('카카오 SDK가 로드되지 않았습니다.');
      expect(consoleWarnSpy).not.toHaveBeenCalled(); // Ensure no warn from missing key
    });

    it('VITE_KAKAO_JAVASCRIPT_KEY가 있고 window.Kakao가 있으면 Kakao SDK를 초기화한다', () => {
      mockImportMeta.env.VITE_KAKAO_JAVASCRIPT_KEY = 'test_kakao_key';
      initializeKakaoSDK();
      expect(window.Kakao.init).toHaveBeenCalledWith('test_kakao_key');
    });

    it('Kakao SDK 초기화 중 에러 발생 시 에러를 출력한다', () => {
      mockImportMeta.env.VITE_KAKAO_JAVASCRIPT_KEY = 'test_kakao_key';
      const mockError = new Error('Kakao init failed');
      (window.Kakao.init as jest.Mock).mockImplementation(() => {
        throw mockError;
      });
      initializeKakaoSDK();
      expect(consoleErrorSpy).toHaveBeenCalledWith('카카오 SDK 초기화에 실패했습니다:', mockError);
    });
  });
});

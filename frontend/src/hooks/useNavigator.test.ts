import { useNavigate } from 'react-router-dom';
import { renderHook, RenderHookResult } from '@testing-library/react';
import useNavigator from '@/hooks/useNavigator';
import isInAppWebView from '@/utils/isInAppWebView';
import {
  requestNavigateWebview,
  requestOpenExternalUrl,
} from '@/utils/webviewBridge';

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));
jest.mock('@/utils/isInAppWebView');
jest.mock('@/utils/webviewBridge', () => ({
  requestNavigateWebview: jest.fn(),
  requestOpenExternalUrl: jest.fn(),
}));

const mockIsInAppWebView = isInAppWebView as jest.Mock;
const mockRequestNavigateWebview = requestNavigateWebview as jest.Mock;
const mockRequestOpenExternalUrl = requestOpenExternalUrl as jest.Mock;

describe('useNavigator - 사용자가 링크를 클릭했을 때', () => {
  const mockNavigate = jest.fn();
  const originalLocation = window.location;
  let handleLink: RenderHookResult<(url: string) => void, unknown>;

  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    mockIsInAppWebView.mockReturnValue(false);

    Object.defineProperty(window, 'location', {
      writable: true,
      value: { href: '' },
    });
    window.open = jest.fn();

    handleLink = renderHook(() => useNavigator());
  });

  afterEach(() => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: originalLocation,
    });
  });

  describe('링크가 비어있으면', () => {
    it('아무 페이지로도 이동하지 않는다', () => {
      handleLink.result.current('');

      expect(mockNavigate).not.toHaveBeenCalled();
      expect(window.location.href).toBe('');
    });

    it('공백만 있는 링크도 이동하지 않는다', () => {
      handleLink.result.current('   ');

      expect(mockNavigate).not.toHaveBeenCalled();
      expect(window.location.href).toBe('');
    });
  });

  describe('악성 링크를 클릭하면', () => {
    it.each([
      ['javascript', 'javascript:alert("XSS")'],
      ['data', 'data:text/html,<script>alert("XSS")</script>'],
      ['vbscript', 'vbscript:msgbox("XSS")'],
      ['대문자 javascript', 'JAVASCRIPT:alert("XSS")'],
    ])('%s 프로토콜 링크는 차단된다', (_, maliciousUrl) => {
      handleLink.result.current(maliciousUrl);

      expect(mockNavigate).not.toHaveBeenCalled();
      expect(window.location.href).toBe('');
    });
  });

  describe('일반 웹에서', () => {
    describe('외부 링크를 클릭하면', () => {
      it.each([
        ['https', 'https://example.com'],
        ['http', 'http://example.com'],
        ['itms-apps', 'itms-apps://itunes.apple.com/app/123456'],
      ])('%s 링크는 window.location.href로 이동한다', (_, externalUrl) => {
        handleLink.result.current(externalUrl);

        expect(window.location.href).toBe(externalUrl);
        expect(mockNavigate).not.toHaveBeenCalled();
      });
    });

    describe('내부 경로를 클릭하면', () => {
      it('React Router로 이동한다', () => {
        handleLink.result.current('/introduce');

        expect(mockNavigate).toHaveBeenCalledWith('/introduce');
        expect(window.location.href).toBe('');
      });

      it('상대 경로도 React Router로 이동한다', () => {
        handleLink.result.current('about');

        expect(mockNavigate).toHaveBeenCalledWith('about');
        expect(window.location.href).toBe('');
      });
    });
  });

  describe('웹뷰에서', () => {
    beforeEach(() => {
      mockIsInAppWebView.mockReturnValue(true);
      handleLink = renderHook(() => useNavigator());
    });

    describe('외부 링크를 클릭하면', () => {
      it('http/https 링크는 requestOpenExternalUrl로 앱에 위임한다', () => {
        mockRequestOpenExternalUrl.mockReturnValue(true);

        handleLink.result.current('https://example.com');

        expect(mockRequestOpenExternalUrl).toHaveBeenCalledWith(
          'https://example.com',
        );
        expect(window.location.href).toBe('');
      });

      it('itms-apps:// 링크는 requestOpenExternalUrl이 false를 반환하면 window.open으로 폴백한다', () => {
        mockRequestOpenExternalUrl.mockReturnValue(false);

        handleLink.result.current('itms-apps://itunes.apple.com/app/123456');

        expect(mockRequestOpenExternalUrl).toHaveBeenCalled();
        expect(window.open).toHaveBeenCalledWith(
          'itms-apps://itunes.apple.com/app/123456',
        );
      });
    });

    describe('내부 경로를 클릭하면', () => {
      it('requestNavigateWebview로 앱에 위임한다', () => {
        handleLink.result.current('/promotions/123');

        expect(mockRequestNavigateWebview).toHaveBeenCalledWith(
          'promotions/123',
        );
        expect(mockNavigate).not.toHaveBeenCalled();
      });

      it('leading slash를 제거한 slug로 전달한다', () => {
        handleLink.result.current('/festival-introduction');

        expect(mockRequestNavigateWebview).toHaveBeenCalledWith(
          'festival-introduction',
        );
      });
    });
  });
});

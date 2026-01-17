import { useNavigate } from 'react-router-dom';
import { renderHook, RenderHookResult } from '@testing-library/react';
import useNavigator from '@/hooks/useNavigator';

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

describe('useNavigator - 사용자가 링크를 클릭했을 때', () => {
  const mockNavigate = jest.fn();
  const originalLocation = window.location;
  let handleLink: RenderHookResult<(url: string) => void, unknown>;

  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);

    Object.defineProperty(window, 'location', {
      writable: true,
      value: { href: '' },
    });

    // given
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
      // When
      handleLink.result.current('');

      // Then
      expect(mockNavigate).not.toHaveBeenCalled();
      expect(window.location.href).toBe('');
    });

    it('공백만 있는 링크도 이동하지 않는다', () => {
      // When
      handleLink.result.current('   ');

      // Then
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
      // When
      handleLink.result.current(maliciousUrl);

      // Then
      expect(mockNavigate).not.toHaveBeenCalled();
      expect(window.location.href).toBe('');
    });
  });

  describe('외부 사이트 링크를 클릭하면', () => {
    it.each([
      ['https', 'https://example.com'],
      ['http', 'http://example.com'],
      ['App Store (itms-apps)', 'itms-apps://itunes.apple.com/app/123456'],
    ])('%s 링크는 해당 사이트로 이동한다', (_, externalUrl) => {
      // When
      handleLink.result.current(externalUrl);

      // Then
      expect(window.location.href).toBe(externalUrl);
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  describe('내부 페이지 링크를 클릭하면', () => {
    it('소개 페이지로 이동할 수 있다', () => {
      // When
      handleLink.result.current('/introduce');

      // Then
      expect(mockNavigate).toHaveBeenCalledWith('/introduce');
      expect(window.location.href).toBe('');
    });

    it('상대 경로로도 이동할 수 있다', () => {
      // When
      handleLink.result.current('about');

      // Then
      expect(mockNavigate).toHaveBeenCalledWith('about');
      expect(window.location.href).toBe('');
    });
  });
});

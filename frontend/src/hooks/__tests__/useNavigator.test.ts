import { renderHook, RenderHookResult } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import useNavigator from '../useNavigator';

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
    it('javascript 실행 링크는 차단된다', () => {
      // When
      handleLink.result.current('javascript:alert("XSS")');

      // Then
      expect(mockNavigate).not.toHaveBeenCalled();
      expect(window.location.href).toBe('');
    });

    it('data 스키마 링크는 차단된다', () => {
      // When
      handleLink.result.current('data:text/html,<script>alert("XSS")</script>');

      // Then
      expect(mockNavigate).not.toHaveBeenCalled();
      expect(window.location.href).toBe('');
    });

    it('vbscript 링크는 차단된다', () => {
      // When
      handleLink.result.current('vbscript:msgbox("XSS")');

      // Then
      expect(mockNavigate).not.toHaveBeenCalled();
      expect(window.location.href).toBe('');
    });

    it('대문자로 된 악성 링크도 차단된다', () => {
      // When
      handleLink.result.current('JAVASCRIPT:alert("XSS")');

      // Then
      expect(mockNavigate).not.toHaveBeenCalled();
      expect(window.location.href).toBe('');
    });
  });

  describe('외부 사이트 링크를 클릭하면', () => {
    it('https 링크는 해당 사이트로 이동한다', () => {
      // When
      handleLink.result.current('https://example.com');

      // Then
      expect(window.location.href).toBe('https://example.com');
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('http 링크는 해당 사이트로 이동한다', () => {
      // When
      handleLink.result.current('http://example.com');

      // Then
      expect(window.location.href).toBe('http://example.com');
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('App Store 링크는 앱스토어로 이동한다', () => {
      // When
      handleLink.result.current('itms-apps://itunes.apple.com/app/123456');

      // Then
      expect(window.location.href).toBe('itms-apps://itunes.apple.com/app/123456');
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


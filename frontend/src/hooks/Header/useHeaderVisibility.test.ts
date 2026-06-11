import { renderHook } from '@testing-library/react';
import useDevice from '@/hooks/useDevice';
import { DeviceType } from '@/types/device';
import isInAppWebView from '@/utils/isInAppWebView';
import useHeaderVisibility from './useHeaderVisibility';

jest.mock('@/hooks/useDevice');
jest.mock('@/utils/isInAppWebView');

const mockUseDevice = useDevice as jest.Mock;
const mockIsInAppWebView = isInAppWebView as jest.Mock;

const setupDevice = (
  overrides: Partial<
    Record<'isMobile' | 'isTablet' | 'isLaptop' | 'isDesktop', boolean>
  > = {},
) => {
  mockUseDevice.mockReturnValue({
    isMobile: false,
    isTablet: false,
    isLaptop: false,
    isDesktop: true,
    ...overrides,
  });
};

describe('useHeaderVisibility 테스트', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupDevice();
    mockIsInAppWebView.mockReturnValue(false);
  });

  describe('props 없을 때 (기본값)', () => {
    it('showOn, hideOn 모두 없으면 항상 true를 반환한다', () => {
      // Given & When
      const { result } = renderHook(() => useHeaderVisibility());

      // Then
      expect(result.current).toBe(true);
    });
  });

  describe('hideOn 테스트', () => {
    it('현재 디바이스가 hideOn에 포함되면 false를 반환한다', () => {
      // Given
      setupDevice({ isDesktop: true });

      // When
      const { result } = renderHook(() =>
        useHeaderVisibility(undefined, ['desktop']),
      );

      // Then
      expect(result.current).toBe(false);
    });

    it('현재 디바이스가 hideOn에 포함되지 않으면 true를 반환한다', () => {
      // Given
      setupDevice({ isMobile: true, isDesktop: false });

      // When
      const { result } = renderHook(() =>
        useHeaderVisibility(undefined, ['desktop']),
      );

      // Then
      expect(result.current).toBe(true);
    });

    it('hideOn에 여러 디바이스가 있을 때 하나라도 일치하면 false를 반환한다', () => {
      // Given
      setupDevice({ isTablet: true, isDesktop: false });

      // When
      const { result } = renderHook(() =>
        useHeaderVisibility(undefined, ['mobile', 'tablet'] as DeviceType[]),
      );

      // Then
      expect(result.current).toBe(false);
    });

    it('webview 환경에서 hideOn에 webview가 포함되면 false를 반환한다', () => {
      // Given
      mockIsInAppWebView.mockReturnValue(true);

      // When
      const { result } = renderHook(() =>
        useHeaderVisibility(undefined, ['webview']),
      );

      // Then
      expect(result.current).toBe(false);
    });
  });

  describe('showOn 테스트', () => {
    it('현재 디바이스가 showOn에 포함되면 true를 반환한다', () => {
      // Given
      setupDevice({ isDesktop: true });

      // When
      const { result } = renderHook(() => useHeaderVisibility(['desktop']));

      // Then
      expect(result.current).toBe(true);
    });

    it('현재 디바이스가 showOn에 포함되지 않으면 false를 반환한다', () => {
      // Given
      setupDevice({ isMobile: true, isDesktop: false });

      // When
      const { result } = renderHook(() => useHeaderVisibility(['desktop']));

      // Then
      expect(result.current).toBe(false);
    });

    it('showOn에 여러 디바이스가 있을 때 하나라도 일치하면 true를 반환한다', () => {
      // Given
      setupDevice({ isTablet: true, isDesktop: false });

      // When
      const { result } = renderHook(() =>
        useHeaderVisibility(['mobile', 'tablet'] as DeviceType[]),
      );

      // Then
      expect(result.current).toBe(true);
    });

    it('webview 환경에서 showOn에 webview가 포함되면 true를 반환한다', () => {
      // Given
      setupDevice({ isDesktop: false });
      mockIsInAppWebView.mockReturnValue(true);

      // When
      const { result } = renderHook(() => useHeaderVisibility(['webview']));

      // Then
      expect(result.current).toBe(true);
    });
  });

  describe('빈 배열 경계 조건', () => {
    it('hideOn=[]일 때 showOn이 무시되지 않고 평가된다', () => {
      // Given
      setupDevice({ isDesktop: true });

      // When
      const { result } = renderHook(() => useHeaderVisibility(['desktop'], []));

      // Then
      expect(result.current).toBe(true);
    });

    it('showOn=[]일 때 true를 반환한다 (기본값 fallback)', () => {
      // Given
      setupDevice({ isDesktop: true });

      // When
      const { result } = renderHook(() => useHeaderVisibility([]));

      // Then
      expect(result.current).toBe(true);
    });

    it('hideOn=[], showOn=[]일 때 true를 반환한다', () => {
      // Given & When
      const { result } = renderHook(() => useHeaderVisibility([], []));

      // Then
      expect(result.current).toBe(true);
    });
  });

  describe('hideOn이 showOn보다 우선순위가 높다', () => {
    it('hideOn과 showOn이 동시에 있을 때 hideOn이 우선 적용된다', () => {
      // Given
      setupDevice({ isDesktop: true });

      // When
      const { result } = renderHook(() =>
        useHeaderVisibility(['desktop'], ['desktop']),
      );

      // Then
      expect(result.current).toBe(false);
    });
  });
});

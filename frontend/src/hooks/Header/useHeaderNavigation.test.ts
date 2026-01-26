import { useNavigate } from 'react-router-dom';
import { renderHook } from '@testing-library/react';
import { USER_EVENT } from '@/constants/eventName';
import useMixpanelTrack from '@/hooks/Mixpanel/useMixpanelTrack';
import { useSearchStore } from '@/store/useSearchStore';
import useHeaderNavigation from './useHeaderNavigation';

// Mock dependencies
jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

jest.mock('@/hooks/Mixpanel/useMixpanelTrack');

jest.mock('@/store/useSearchStore', () => ({
  useSearchStore: {
    getState: jest.fn(),
  },
}));

describe('useHeaderNavigation 테스트', () => {
  const mockNavigate = jest.fn();
  const mockTrackEvent = jest.fn();
  const mockResetSearch = jest.fn();
  const originalWindowOpen = window.open;
  const originalInnerWidth = window.innerWidth;

  beforeEach(() => {
    jest.clearAllMocks();

    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);

    (useMixpanelTrack as jest.Mock).mockReturnValue(mockTrackEvent);

    (useSearchStore.getState as jest.Mock).mockReturnValue({
      resetSearch: mockResetSearch,
    });

    window.open = jest.fn();
  });

  afterEach(() => {
    window.open = originalWindowOpen;
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: originalInnerWidth,
    });
  });

  describe('홈 버튼 클릭 테스트', () => {
    it('홈 버튼 클릭 시 메인 페이지로 이동한다', () => {
      // Given
      const { result } = renderHook(() => useHeaderNavigation());

      // When
      result.current.handleHomeClick();

      // Then
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    it('홈 버튼 클릭 시 검색 상태를 초기화한다', () => {
      // Given
      const { result } = renderHook(() => useHeaderNavigation());

      // When
      result.current.handleHomeClick();

      // Then
      expect(useSearchStore.getState).toHaveBeenCalled();
      expect(mockResetSearch).toHaveBeenCalled();
    });

    it('홈 버튼 클릭 시 Mixpanel 이벤트를 전송한다 (데스크톱)', () => {
      // Given
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      });
      const { result } = renderHook(() => useHeaderNavigation());

      // When
      result.current.handleHomeClick();

      // Then
      expect(mockTrackEvent).toHaveBeenCalledWith(
        USER_EVENT.HOME_BUTTON_CLICKED,
        {
          device_type: 'desktop',
        },
      );
    });

    it('홈 버튼 클릭 시 Mixpanel 이벤트를 전송한다 (모바일)', () => {
      // Given
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });
      const { result } = renderHook(() => useHeaderNavigation());

      // When
      result.current.handleHomeClick();

      // Then
      expect(mockTrackEvent).toHaveBeenCalledWith(
        USER_EVENT.HOME_BUTTON_CLICKED,
        {
          device_type: 'mobile',
        },
      );
    });

    it('홈 버튼 클릭 시 Mixpanel 이벤트를 전송한다 (경계값 700px)', () => {
      // Given
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 700,
      });
      const { result } = renderHook(() => useHeaderNavigation());

      // When
      result.current.handleHomeClick();

      // Then
      expect(mockTrackEvent).toHaveBeenCalledWith(
        USER_EVENT.HOME_BUTTON_CLICKED,
        {
          device_type: 'mobile',
        },
      );
    });
  });

  describe('소개 버튼 클릭 테스트', () => {
    it('소개 버튼 클릭 시 소개 페이지로 이동한다', () => {
      // Given
      const { result } = renderHook(() => useHeaderNavigation());

      // When
      result.current.handleIntroduceClick();

      // Then
      expect(mockNavigate).toHaveBeenCalledWith('/introduce');
    });

    it('소개 버튼 클릭 시 Mixpanel 이벤트를 전송한다', () => {
      // Given
      const { result } = renderHook(() => useHeaderNavigation());

      // When
      result.current.handleIntroduceClick();

      // Then
      expect(mockTrackEvent).toHaveBeenCalledWith(
        USER_EVENT.INTRODUCE_BUTTON_CLICKED,
      );
    });
  });

  describe('동아리연합회 버튼 클릭 테스트', () => {
    it('동아리연합회 버튼 클릭 시 동아리연합회 페이지로 이동한다', () => {
      // Given
      const { result } = renderHook(() => useHeaderNavigation());

      // When
      result.current.handleClubUnionClick();

      // Then
      expect(mockNavigate).toHaveBeenCalledWith('/club-union');
    });

    it('동아리연합회 버튼 클릭 시 Mixpanel 이벤트를 전송한다', () => {
      // Given
      const { result } = renderHook(() => useHeaderNavigation());

      // When
      result.current.handleClubUnionClick();

      // Then
      expect(mockTrackEvent).toHaveBeenCalledWith(
        USER_EVENT.CLUB_UNION_BUTTON_CLICKED,
      );
    });
  });

  describe('관리자 버튼 클릭 테스트', () => {
    it('관리자 버튼 클릭 시 관리자 페이지로 이동한다', () => {
      // Given
      const { result } = renderHook(() => useHeaderNavigation());

      // When
      result.current.handleAdminClick();

      // Then
      expect(mockNavigate).toHaveBeenCalledWith('/admin');
    });

    it('관리자 버튼 클릭 시 Mixpanel 이벤트를 전송한다', () => {
      // Given
      const { result } = renderHook(() => useHeaderNavigation());

      // When
      result.current.handleAdminClick();

      // Then
      expect(mockTrackEvent).toHaveBeenCalledWith(
        USER_EVENT.ADMIN_BUTTON_CLICKED,
      );
    });
  });

  describe('반환값 검증 테스트', () => {
    it('모든 핸들러 함수를 반환한다', () => {
      // Given & When
      const { result } = renderHook(() => useHeaderNavigation());

      // Then
      expect(result.current).toHaveProperty('handleHomeClick');
      expect(result.current).toHaveProperty('handleIntroduceClick');
      expect(result.current).toHaveProperty('handleClubUnionClick');
      expect(result.current).toHaveProperty('handleAdminClick');
    });

    it('모든 핸들러가 함수 타입이다', () => {
      // Given & When
      const { result } = renderHook(() => useHeaderNavigation());

      // Then
      expect(typeof result.current.handleHomeClick).toBe('function');
      expect(typeof result.current.handleIntroduceClick).toBe('function');
      expect(typeof result.current.handleClubUnionClick).toBe('function');
      expect(typeof result.current.handleAdminClick).toBe('function');
    });
  });

  describe('복합 시나리오 테스트', () => {
    it('여러 버튼을 순차적으로 클릭할 수 있다', () => {
      // Given
      const { result } = renderHook(() => useHeaderNavigation());

      // When
      result.current.handleHomeClick();
      result.current.handleIntroduceClick();
      result.current.handleAdminClick();

      // Then
      expect(mockNavigate).toHaveBeenCalledTimes(3);
      expect(mockNavigate).toHaveBeenNthCalledWith(1, '/');
      expect(mockNavigate).toHaveBeenNthCalledWith(2, '/introduce');
      expect(mockNavigate).toHaveBeenNthCalledWith(3, '/admin');
    });

    it('모든 네비게이션 액션이 Mixpanel 이벤트를 트리거한다', () => {
      // Given
      const { result } = renderHook(() => useHeaderNavigation());

      // When
      result.current.handleHomeClick();
      result.current.handleIntroduceClick();
      result.current.handleClubUnionClick();
      result.current.handleAdminClick();

      // Then
      expect(mockTrackEvent).toHaveBeenCalledTimes(4);
    });
  });
});

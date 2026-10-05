import { useLocation } from 'react-router-dom';
import { renderHook } from '@testing-library/react';
import mixpanel from 'mixpanel-browser';
import { PageViewName } from '@/constants/eventName';
import useTrackPageView from './useTrackPageView';

jest.mock('mixpanel-browser', () => ({
  track: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  useLocation: jest.fn(),
}));

describe('useTrackPageView', () => {
  const originalDateNow = Date.now;
  const originalLocation = window.location;
  const originalReferrer = Object.getOwnPropertyDescriptor(
    document,
    'referrer',
  );
  const originalHidden = Object.getOwnPropertyDescriptor(
    Document.prototype,
    'hidden',
  );

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock Date.now
    Date.now = jest.fn(() => 1234567890);

    // Mock useLocation
    (useLocation as jest.Mock).mockReturnValue({
      pathname: '/test-page',
      search: '',
      hash: '',
      state: null,
    });

    // Mock window.location.href
    Object.defineProperty(window, 'location', {
      writable: true,
      configurable: true,
      value: { href: 'https://example.com/test-page' },
    });

    // Mock document.referrer
    Object.defineProperty(document, 'referrer', {
      writable: true,
      configurable: true,
      value: 'https://google.com',
    });

    // Mock document.hidden
    Object.defineProperty(document, 'hidden', {
      writable: true,
      configurable: true,
      value: false,
    });
  });

  afterEach(() => {
    Date.now = originalDateNow;

    Object.defineProperty(window, 'location', {
      writable: true,
      configurable: true,
      value: originalLocation,
    });

    if (originalReferrer) {
      Object.defineProperty(document, 'referrer', originalReferrer);
    }

    if (originalHidden) {
      Object.defineProperty(Document.prototype, 'hidden', originalHidden);
    }
  });

  describe('페이지 방문 트래킹 테스트', () => {
    it('페이지 방문 시 Page Viewed 이벤트를 트래킹한다', () => {
      // When
      renderHook(() => useTrackPageView('main'));

      // Then
      expect(mixpanel.track).toHaveBeenCalledWith('Page Viewed', {
        page_name: 'main',
        user_area: 'student',
        url: 'https://example.com/test-page',
        timestamp: 1234567890,
        referrer: 'https://google.com',
        club_name: undefined,
      });
    });

    it('clubName과 함께 페이지 방문을 트래킹한다', () => {
      // When
      renderHook(() =>
        useTrackPageView('club_detail', { clubName: '테스트 동아리' }),
      );

      // Then
      expect(mixpanel.track).toHaveBeenCalledWith('Page Viewed', {
        page_name: 'club_detail',
        user_area: 'student',
        url: 'https://example.com/test-page',
        timestamp: 1234567890,
        referrer: 'https://google.com',
        club_name: '테스트 동아리',
      });
    });

    it('동아리 페이지는 club_id와 club_name을 함께 보낸다', () => {
      // When
      renderHook(() =>
        useTrackPageView('club_detail', {
          clubId: 'club-1',
          clubName: '테스트 동아리',
        }),
      );

      // Then
      expect(mixpanel.track).toHaveBeenCalledWith(
        'Page Viewed',
        expect.objectContaining({
          page_name: 'club_detail',
          club_id: 'club-1',
          club_name: '테스트 동아리',
        }),
      );
    });

    it('관리자 페이지는 user_area를 admin으로 보낸다', () => {
      // When
      renderHook(() => useTrackPageView('admin_calendar'));

      // Then
      expect(mixpanel.track).toHaveBeenCalledWith(
        'Page Viewed',
        expect.objectContaining({ user_area: 'admin' }),
      );
    });

    it('referrer가 없을 때 direct로 표시한다', () => {
      // Given
      Object.defineProperty(document, 'referrer', {
        writable: true,
        configurable: true,
        value: '',
      });

      // When
      renderHook(() => useTrackPageView('main'));

      // Then
      expect(mixpanel.track).toHaveBeenCalledWith(
        'Page Viewed',
        expect.objectContaining({
          page_name: 'main',
          referrer: 'direct',
        }),
      );
    });

    it('skip이 true일 때 트래킹하지 않는다', () => {
      // When
      renderHook(() => useTrackPageView('main', { skip: true }));

      // Then
      expect(mixpanel.track).not.toHaveBeenCalled();
    });
  });

  describe('페이지 체류 시간 트래킹 테스트', () => {
    it('컴포넌트 언마운트 시 Page Left 이벤트를 트래킹한다', () => {
      // Given
      let currentTime = 1234567890;
      Date.now = jest.fn(() => currentTime);

      // When - 마운트
      const { unmount } = renderHook(() => useTrackPageView('main'));

      // 5초 경과
      currentTime = 1234567890 + 5000;

      // When - 언마운트
      unmount();

      // Then
      expect(mixpanel.track).toHaveBeenCalledWith('Page Left', {
        page_name: 'main',
        user_area: 'student',
        url: 'https://example.com/test-page',
        duration: 5000,
        duration_seconds: 5,
        club_name: undefined,
      });
    });

    it('beforeunload 이벤트 발생 시 Page Left를 트래킹한다', () => {
      // Given
      let currentTime = 1234567890;
      Date.now = jest.fn(() => currentTime);

      // When - 마운트
      renderHook(() => useTrackPageView('main'));

      // 10초 경과
      currentTime = 1234567890 + 10000;

      // beforeunload 이벤트 발생
      window.dispatchEvent(new Event('beforeunload'));

      // Then
      expect(mixpanel.track).toHaveBeenCalledWith('Page Left', {
        page_name: 'main',
        user_area: 'student',
        url: 'https://example.com/test-page',
        duration: 10000,
        duration_seconds: 10,
        club_name: undefined,
      });
    });

    it('페이지가 숨겨질 때 (visibilitychange) Page Left를 트래킹한다', () => {
      // Given
      let currentTime = 1234567890;
      Date.now = jest.fn(() => currentTime);

      // When - 마운트
      renderHook(() => useTrackPageView('main'));

      // 3초 경과
      currentTime = 1234567890 + 3000;

      // 페이지 숨김
      Object.defineProperty(document, 'hidden', {
        writable: true,
        configurable: true,
        value: true,
      });
      document.dispatchEvent(new Event('visibilitychange'));

      // Then
      expect(mixpanel.track).toHaveBeenCalledWith('Page Left', {
        page_name: 'main',
        user_area: 'student',
        url: 'https://example.com/test-page',
        duration: 3000,
        duration_seconds: 3,
        club_name: undefined,
      });
    });

    it('페이지가 다시 보일 때는 Page Left를 트래킹하지 않는다', () => {
      // Given
      renderHook(() => useTrackPageView('main'));
      jest.clearAllMocks();

      // When - 페이지가 보임 (hidden = false)
      Object.defineProperty(document, 'hidden', {
        writable: true,
        configurable: true,
        value: false,
      });
      document.dispatchEvent(new Event('visibilitychange'));

      // Then - Page Left 이벤트가 트래킹되지 않음
      expect(mixpanel.track).not.toHaveBeenCalledWith(
        'Page Left',
        expect.objectContaining({ page_name: 'main' }),
      );
    });

    it('Page Left는 한 번만 트래킹된다 (중복 방지)', () => {
      // Given
      let currentTime = 1234567890;
      Date.now = jest.fn(() => currentTime);
      const { unmount } = renderHook(() => useTrackPageView('main'));

      // 5초 경과
      currentTime = 1234567890 + 5000;

      // When - beforeunload 발생
      window.dispatchEvent(new Event('beforeunload'));

      // 추가로 visibilitychange 발생
      Object.defineProperty(document, 'hidden', {
        writable: true,
        configurable: true,
        value: true,
      });
      document.dispatchEvent(new Event('visibilitychange'));

      // 언마운트
      unmount();

      // Then - Page Left 이벤트가 한 번만 호출됨 (Page Viewed 1번 + Page Left 1번 = 총 2번)
      expect(mixpanel.track).toHaveBeenCalledTimes(2);
      expect(mixpanel.track).toHaveBeenCalledWith(
        'Page Left',
        expect.objectContaining({ page_name: 'main' }),
      );
    });
  });

  describe('경로 변경 시 재트래킹 테스트', () => {
    it('경로가 변경되면 새로운 Page Viewed 이벤트를 트래킹한다', () => {
      // Given
      const { rerender } = renderHook(() => useTrackPageView('main'));
      jest.clearAllMocks();

      // When - 경로 변경
      (useLocation as jest.Mock).mockReturnValue({
        pathname: '/new-page',
        search: '',
        hash: '',
        state: null,
      });
      rerender();

      // Then
      expect(mixpanel.track).toHaveBeenCalledWith(
        'Page Viewed',
        expect.objectContaining({ page_name: 'main' }),
      );
    });

    it('clubName이 변경되면 새로운 Page Viewed 이벤트를 트래킹한다', () => {
      // Given
      const { rerender } = renderHook(
        ({ clubName }) => useTrackPageView('club_detail', { clubName }),
        { initialProps: { clubName: '동아리A' } },
      );
      jest.clearAllMocks();

      // When - clubName 변경
      rerender({ clubName: '동아리B' });

      // Then
      expect(mixpanel.track).toHaveBeenCalledWith(
        'Page Viewed',
        expect.objectContaining({
          page_name: 'club_detail',
          club_name: '동아리B',
        }),
      );
    });

    it('pageName이 변경되면 새로운 Page Viewed 이벤트를 트래킹한다', () => {
      // Given
      const { rerender } = renderHook(
        ({ pageName }) => useTrackPageView(pageName),
        { initialProps: { pageName: 'main' as PageViewName } },
      );
      jest.clearAllMocks();

      // When - pageName 변경
      rerender({ pageName: 'menu' });

      // Then
      expect(mixpanel.track).toHaveBeenCalledWith(
        'Page Viewed',
        expect.objectContaining({ page_name: 'menu' }),
      );
    });
  });

  describe('이벤트 리스너 정리 테스트', () => {
    it('언마운트 시 이벤트 리스너가 제거된다', () => {
      // Given
      const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
      const documentRemoveEventListenerSpy = jest.spyOn(
        document,
        'removeEventListener',
      );

      // When
      const { unmount } = renderHook(() => useTrackPageView('main'));
      unmount();

      // Then
      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'beforeunload',
        expect.any(Function),
      );
      expect(documentRemoveEventListenerSpy).toHaveBeenCalledWith(
        'visibilitychange',
        expect.any(Function),
      );

      removeEventListenerSpy.mockRestore();
      documentRemoveEventListenerSpy.mockRestore();
    });
  });

  describe('체류 시간 계산 정확도 테스트', () => {
    it('duration_seconds가 올바르게 반올림된다', () => {
      // Given
      let currentTime = 1234567890;
      Date.now = jest.fn(() => currentTime);
      const { unmount } = renderHook(() => useTrackPageView('main'));

      // 7.6초 경과
      currentTime = 1234567890 + 7600;

      // When
      unmount();

      // Then
      expect(mixpanel.track).toHaveBeenCalledWith(
        'Page Left',
        expect.objectContaining({
          page_name: 'main',
          duration: 7600,
          duration_seconds: 8, // 반올림
        }),
      );
    });

    it('1초 미만 체류 시간도 정확히 기록된다', () => {
      // Given
      let currentTime = 1234567890;
      Date.now = jest.fn(() => currentTime);
      const { unmount } = renderHook(() => useTrackPageView('main'));

      // 500ms 경과
      currentTime = 1234567890 + 500;

      // When
      unmount();

      // Then
      expect(mixpanel.track).toHaveBeenCalledWith(
        'Page Left',
        expect.objectContaining({
          page_name: 'main',
          duration: 500,
          duration_seconds: 1, // 반올림
        }),
      );
    });
  });

  describe('skip 파라미터 테스트', () => {
    it('skip이 false일 때 정상적으로 트래킹한다', () => {
      // When
      renderHook(() => useTrackPageView('main', { skip: false }));

      // Then
      expect(mixpanel.track).toHaveBeenCalledWith(
        'Page Viewed',
        expect.objectContaining({ page_name: 'main' }),
      );
    });

    it('skip이 true에서 false로 변경되면 트래킹을 시작한다', () => {
      // Given
      const { rerender } = renderHook(
        ({ skip }) => useTrackPageView('main', { skip }),
        { initialProps: { skip: true } },
      );
      jest.clearAllMocks();

      // When
      rerender({ skip: false });

      // Then
      expect(mixpanel.track).toHaveBeenCalledWith(
        'Page Viewed',
        expect.objectContaining({ page_name: 'main' }),
      );
    });
  });
});

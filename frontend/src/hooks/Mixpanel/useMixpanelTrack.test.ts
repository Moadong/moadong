import { renderHook } from '@testing-library/react';
import mixpanel from 'mixpanel-browser';
import useMixpanelTrack from './useMixpanelTrack';

jest.mock('mixpanel-browser', () => ({
  track: jest.fn(),
  get_distinct_id: jest.fn(),
}));

describe('useMixpanelTrack', () => {
  const mockDistinctId = 'test-user-123';
  const originalLocation = window.location;
  const originalDateNow = Date.now;

  beforeEach(() => {
    jest.clearAllMocks();

    (mixpanel.get_distinct_id as jest.Mock).mockReturnValue(mockDistinctId);

    const mockTimestamp = 1234567890;
    Date.now = jest.fn(() => mockTimestamp);

    Object.defineProperty(window, 'location', {
      writable: true,
      value: { href: 'https://example.com/test-page' },
    });
  });

  afterEach(() => {
    Date.now = originalDateNow;
    Object.defineProperty(window, 'location', {
      writable: true,
      value: originalLocation,
    });
  });

  describe('기본 이벤트 트래킹 테스트', () => {
    it('이벤트를 트래킹할 수 있다', () => {
      // Given
      const { result } = renderHook(() => useMixpanelTrack());

      // When
      result.current('Test Event');

      // Then
      expect(mixpanel.track).toHaveBeenCalledWith('Test Event', {
        distinct_id: mockDistinctId,
        timestamp: 1234567890,
        url: 'https://example.com/test-page',
      });
    });

    it('커스텀 속성과 함께 이벤트를 트래킹할 수 있다', () => {
      // Given
      const { result } = renderHook(() => useMixpanelTrack());
      const customProperties = {
        button_name: 'Submit',
        page_section: 'Header',
      };

      // When
      result.current('Button Clicked', customProperties);

      // Then
      expect(mixpanel.track).toHaveBeenCalledWith('Button Clicked', {
        button_name: 'Submit',
        page_section: 'Header',
        distinct_id: mockDistinctId,
        timestamp: 1234567890,
        url: 'https://example.com/test-page',
      });
    });

    it('속성 없이 이벤트를 트래킹할 수 있다', () => {
      // Given
      const { result } = renderHook(() => useMixpanelTrack());

      // When
      result.current('Simple Event');

      // Then
      expect(mixpanel.track).toHaveBeenCalledWith('Simple Event', {
        distinct_id: mockDistinctId,
        timestamp: 1234567890,
        url: 'https://example.com/test-page',
      });
    });
  });

  describe('자동 추가 속성 테스트', () => {
    it('distinct_id를 자동으로 추가한다', () => {
      // Given
      const { result } = renderHook(() => useMixpanelTrack());

      // When
      result.current('Event');

      // Then
      const callArgs = (mixpanel.track as jest.Mock).mock.calls[0][1];
      expect(callArgs.distinct_id).toBe(mockDistinctId);
      expect(mixpanel.get_distinct_id).toHaveBeenCalled();
    });

    it('timestamp를 자동으로 추가한다', () => {
      // Given
      const { result } = renderHook(() => useMixpanelTrack());

      // When
      result.current('Event');

      // Then
      const callArgs = (mixpanel.track as jest.Mock).mock.calls[0][1];
      expect(callArgs.timestamp).toBe(1234567890);
    });

    it('현재 URL을 자동으로 추가한다', () => {
      // Given
      const { result } = renderHook(() => useMixpanelTrack());

      // When
      result.current('Event');

      // Then
      const callArgs = (mixpanel.track as jest.Mock).mock.calls[0][1];
      expect(callArgs.url).toBe('https://example.com/test-page');
    });

    it('커스텀 속성이 자동 속성과 병합된다', () => {
      // Given
      const { result } = renderHook(() => useMixpanelTrack());

      // When
      result.current('Event', { custom_prop: 'value' });

      // Then
      expect(mixpanel.track).toHaveBeenCalledWith('Event', {
        custom_prop: 'value',
        distinct_id: mockDistinctId,
        timestamp: 1234567890,
        url: 'https://example.com/test-page',
      });
    });
  });

  describe('다양한 데이터 타입 테스트', () => {
    it('문자열 속성을 트래킹할 수 있다', () => {
      // Given
      const { result } = renderHook(() => useMixpanelTrack());

      // When
      result.current('Event', { name: 'test' });

      // Then
      const callArgs = (mixpanel.track as jest.Mock).mock.calls[0][1];
      expect(callArgs.name).toBe('test');
    });

    it('숫자 속성을 트래킹할 수 있다', () => {
      // Given
      const { result } = renderHook(() => useMixpanelTrack());

      // When
      result.current('Event', { count: 42, price: 99.99 });

      // Then
      const callArgs = (mixpanel.track as jest.Mock).mock.calls[0][1];
      expect(callArgs.count).toBe(42);
      expect(callArgs.price).toBe(99.99);
    });

    it('불리언 속성을 트래킹할 수 있다', () => {
      // Given
      const { result } = renderHook(() => useMixpanelTrack());

      // When
      result.current('Event', { is_logged_in: true, is_premium: false });

      // Then
      const callArgs = (mixpanel.track as jest.Mock).mock.calls[0][1];
      expect(callArgs.is_logged_in).toBe(true);
      expect(callArgs.is_premium).toBe(false);
    });

    it('배열 속성을 트래킹할 수 있다', () => {
      // Given
      const { result } = renderHook(() => useMixpanelTrack());

      // When
      result.current('Event', { tags: ['tag1', 'tag2', 'tag3'] });

      // Then
      const callArgs = (mixpanel.track as jest.Mock).mock.calls[0][1];
      expect(callArgs.tags).toEqual(['tag1', 'tag2', 'tag3']);
    });

    it('객체 속성을 트래킹할 수 있다', () => {
      // Given
      const { result } = renderHook(() => useMixpanelTrack());

      // When
      result.current('Event', { user: { name: 'John', age: 30 } });

      // Then
      const callArgs = (mixpanel.track as jest.Mock).mock.calls[0][1];
      expect(callArgs.user).toEqual({ name: 'John', age: 30 });
    });
  });

  describe('복합 시나리오 테스트', () => {
    it('여러 이벤트를 순차적으로 트래킹할 수 있다', () => {
      // Given
      const { result } = renderHook(() => useMixpanelTrack());

      // When
      result.current('Event 1', { prop1: 'value1' });
      result.current('Event 2', { prop2: 'value2' });
      result.current('Event 3', { prop3: 'value3' });

      // Then
      expect(mixpanel.track).toHaveBeenCalledTimes(3);
      expect(mixpanel.track).toHaveBeenNthCalledWith(
        1,
        'Event 1',
        expect.objectContaining({ prop1: 'value1' }),
      );
      expect(mixpanel.track).toHaveBeenNthCalledWith(
        2,
        'Event 2',
        expect.objectContaining({ prop2: 'value2' }),
      );
      expect(mixpanel.track).toHaveBeenNthCalledWith(
        3,
        'Event 3',
        expect.objectContaining({ prop3: 'value3' }),
      );
    });

    it('동일한 이벤트를 여러 번 트래킹할 수 있다', () => {
      // Given
      const { result } = renderHook(() => useMixpanelTrack());

      // When
      result.current('Button Clicked');
      result.current('Button Clicked');
      result.current('Button Clicked');

      // Then
      expect(mixpanel.track).toHaveBeenCalledTimes(3);
      expect(mixpanel.track).toHaveBeenCalledWith(
        'Button Clicked',
        expect.any(Object),
      );
    });
  });

  describe('함수 참조 안정성 테스트', () => {
    it('trackEvent 함수 참조가 안정적이다 (리렌더링 시 변경되지 않음)', () => {
      // Given
      const { result, rerender } = renderHook(() => useMixpanelTrack());
      const firstReference = result.current;

      // When
      rerender();

      // Then
      expect(result.current).toBe(firstReference);
    });
  });

  describe('엣지 케이스 테스트', () => {
    it('빈 객체를 속성으로 전달할 수 있다', () => {
      // Given
      const { result } = renderHook(() => useMixpanelTrack());

      // When
      result.current('Event', {});

      // Then
      expect(mixpanel.track).toHaveBeenCalledWith('Event', {
        distinct_id: mockDistinctId,
        timestamp: 1234567890,
        url: 'https://example.com/test-page',
      });
    });

    it('null 값을 속성으로 전달할 수 있다', () => {
      // Given
      const { result } = renderHook(() => useMixpanelTrack());

      // When
      result.current('Event', { nullable_field: null });

      // Then
      const callArgs = (mixpanel.track as jest.Mock).mock.calls[0][1];
      expect(callArgs.nullable_field).toBeNull();
    });

    it('undefined 값을 속성으로 전달할 수 있다', () => {
      // Given
      const { result } = renderHook(() => useMixpanelTrack());

      // When
      result.current('Event', { undefined_field: undefined });

      // Then
      const callArgs = (mixpanel.track as jest.Mock).mock.calls[0][1];
      expect(callArgs.undefined_field).toBeUndefined();
    });

    it('빈 문자열을 이벤트 이름으로 사용할 수 있다', () => {
      // Given
      const { result } = renderHook(() => useMixpanelTrack());

      // When
      result.current('');

      // Then
      expect(mixpanel.track).toHaveBeenCalledWith('', expect.any(Object));
    });
  });
});

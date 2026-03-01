import { act, renderHook } from '@testing-library/react';
import { useCurrentTime } from './useCurrentTime';

describe('useCurrentTime', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('현재 시각을 HH:mm 형식으로 반환한다', () => {
    jest.setSystemTime(new Date('2026-03-01T13:05:00'));

    const { result } = renderHook(() => useCurrentTime());

    expect(result.current).toBe('13:05');
  });

  it('자정은 00:00으로 반환한다', () => {
    jest.setSystemTime(new Date('2026-03-01T00:00:00'));

    const { result } = renderHook(() => useCurrentTime());

    expect(result.current).toBe('00:00');
  });

  it('1분 후 시각이 자동 갱신된다', () => {
    jest.setSystemTime(new Date('2026-03-01T13:05:00'));

    const { result } = renderHook(() => useCurrentTime());
    expect(result.current).toBe('13:05');

    act(() => {
      jest.advanceTimersByTime(59_999);
    });
    expect(result.current).toBe('13:05');

    act(() => {
      jest.setSystemTime(new Date('2026-03-01T13:06:00'));
      jest.advanceTimersByTime(1);
    });
    expect(result.current).toBe('13:06');
  });

  it('언마운트 시 interval이 정리된다', () => {
    jest.setSystemTime(new Date('2026-03-01T13:05:00'));
    const clearIntervalSpy = jest.spyOn(global, 'clearInterval');

    const { unmount } = renderHook(() => useCurrentTime());
    unmount();

    expect(clearIntervalSpy).toHaveBeenCalledTimes(1);
  });
});

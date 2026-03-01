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

  it('다음 분 경계에 시각이 갱신된다', () => {
    // 13:05:30 — 다음 분 경계까지 30초 남음
    jest.setSystemTime(new Date('2026-03-01T13:05:30'));

    const { result } = renderHook(() => useCurrentTime());
    expect(result.current).toBe('13:05');

    // 29초 경과 — 아직 갱신 안 됨
    act(() => { jest.advanceTimersByTime(29_999); });
    expect(result.current).toBe('13:05');

    // 분 경계 도달 (30초 timeout 완료)
    act(() => {
      jest.setSystemTime(new Date('2026-03-01T13:06:00'));
      jest.advanceTimersByTime(1);
    });
    expect(result.current).toBe('13:06');
  });

  it('언마운트 시 타이머가 정리된다', () => {
    jest.setSystemTime(new Date('2026-03-01T13:05:00'));
    const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');

    const { unmount } = renderHook(() => useCurrentTime());
    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalledTimes(1);
  });
});

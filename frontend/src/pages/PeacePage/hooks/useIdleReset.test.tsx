import { act, renderHook } from '@testing-library/react';
import { useIdleReset } from './useIdleReset';

describe('useIdleReset', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('지정 시간 동안 입력이 없으면 onIdle을 부른다', () => {
    const onIdle = jest.fn();
    renderHook(() => useIdleReset(true, 1000, onIdle));
    act(() => jest.advanceTimersByTime(1000));
    expect(onIdle).toHaveBeenCalledTimes(1);
  });

  it('포인터 입력이 있으면 타이머가 다시 시작된다', () => {
    const onIdle = jest.fn();
    renderHook(() => useIdleReset(true, 1000, onIdle));
    act(() => jest.advanceTimersByTime(700));
    act(() => {
      window.dispatchEvent(new Event('pointerdown'));
    });
    act(() => jest.advanceTimersByTime(700));
    expect(onIdle).not.toHaveBeenCalled();
    act(() => jest.advanceTimersByTime(300));
    expect(onIdle).toHaveBeenCalledTimes(1);
  });

  it('비활성이면 아무것도 하지 않는다', () => {
    const onIdle = jest.fn();
    renderHook(() => useIdleReset(false, 1000, onIdle));
    act(() => jest.advanceTimersByTime(5000));
    expect(onIdle).not.toHaveBeenCalled();
  });
});

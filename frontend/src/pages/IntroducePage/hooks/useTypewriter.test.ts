// 타자 효과가 화면 밖(active=false)에서는 멈추고, 다시 보이면 멈춘 자리부터 이어 치는지 검증한다
import { act, renderHook } from '@testing-library/react';
import useTypewriter from './useTypewriter';

const TYPE_MS = 100;

describe('useTypewriter', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('active가 false면 시간이 지나도 글자가 늘지 않는다', () => {
    const { result } = renderHook(() =>
      useTypewriter(['모아동'], { typeMs: TYPE_MS, active: false }),
    );

    act(() => jest.advanceTimersByTime(TYPE_MS * 5));

    expect(result.current).toBe('');
  });

  it('다시 active가 되면 멈춘 자리부터 이어서 친다', () => {
    const { result, rerender } = renderHook(
      ({ active }) => useTypewriter(['모아동'], { typeMs: TYPE_MS, active }),
      { initialProps: { active: true } },
    );

    act(() => jest.advanceTimersByTime(TYPE_MS));
    expect(result.current).toBe('모');

    rerender({ active: false });
    act(() => jest.advanceTimersByTime(TYPE_MS * 5));
    expect(result.current).toBe('모');

    rerender({ active: true });
    act(() => jest.advanceTimersByTime(TYPE_MS));
    expect(result.current).toBe('모아');
  });
});

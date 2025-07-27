import debounce from './debounce';

describe('debounce 함수 테스트', () => {
  let mockfn: jest.Mock;
  let debouncedFn: ReturnType<typeof debounce>;

  beforeEach(() => {
    jest.useFakeTimers();
    mockfn = jest.fn();
    debouncedFn = debounce(mockfn, 1000);
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('지정된 시간 후에 함수가 한 번만 호출된다.', () => {
    debouncedFn();
    debouncedFn();
    debouncedFn();

    expect(mockfn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1000);

    expect(mockfn).toHaveBeenCalledTimes(1);
  });

  it('지정된 시간 내에 함수가 다시 호출되면 타이머가 리셋된다.', () => {
    debouncedFn();
    jest.advanceTimersByTime(500);

    debouncedFn();
    jest.advanceTimersByTime(500);

    expect(mockfn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(500);

    expect(mockfn).toHaveBeenCalledTimes(1);
  });

  it('함수에 전달된 인자가 올바르게 전달된다.', () => {
    debouncedFn('test', 1, 2, 3);
    jest.advanceTimersByTime(1000);

    expect(mockfn).toHaveBeenCalledWith('test', 1, 2, 3);
  });
});

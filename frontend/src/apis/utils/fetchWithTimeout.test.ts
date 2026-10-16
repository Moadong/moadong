import fetchMock from 'jest-fetch-mock';
import { NetworkError } from '@/errors';
import { fetchWithTimeout } from './fetchWithTimeout';

const TEST_URL = 'http://localhost:3000/api/test';

// abort되면 AbortError로 reject되는, 실제 fetch의 취소 동작을 테스트
const mockHangingFetch = () => {
  fetchMock.mockImplementationOnce(
    (_input?: string | Request, init?: RequestInit) =>
      new Promise<Response>((_, reject) => {
        init?.signal?.addEventListener('abort', () =>
          reject(new DOMException('The operation was aborted.', 'AbortError')),
        );
      }),
  );
};

describe('fetchWithTimeout', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('정상 응답은 그대로 반환한다', async () => {
    jest.useFakeTimers();
    fetchMock.mockResponseOnce(JSON.stringify({ ok: true }), {
      status: 200,
    });

    const response = await fetchWithTimeout(TEST_URL);

    expect(response.status).toBe(200);
    // 성공 시 타임아웃 타이머가 정리되어야 한다 (타이머 누수 방지)
    expect(jest.getTimerCount()).toBe(0);
  });

  it('타임아웃 시 시간 초과 메시지의 NetworkError를 던진다', async () => {
    jest.useFakeTimers();
    mockHangingFetch();

    const promise = fetchWithTimeout(TEST_URL, {}, 1000);
    const assertion = expect(promise).rejects.toThrow(
      '요청 시간이 초과되었습니다. 잠시 후 다시 시도해주세요.',
    );

    jest.advanceTimersByTime(1000);

    await assertion;
  });

  it('타임아웃 에러는 NetworkError 인스턴스다', async () => {
    jest.useFakeTimers();
    mockHangingFetch();

    const promise = fetchWithTimeout(TEST_URL, {}, 1000);
    const assertion = expect(promise).rejects.toBeInstanceOf(NetworkError);

    jest.advanceTimersByTime(1000);

    await assertion;
  });

  it('네트워크 연결 실패(TypeError)는 NetworkError로 변환한다', async () => {
    fetchMock.mockRejectOnce(new TypeError('Failed to fetch'));

    await expect(fetchWithTimeout(TEST_URL)).rejects.toBeInstanceOf(
      NetworkError,
    );
  });

  it('AbortError/TypeError 외의 에러는 그대로 전파한다', async () => {
    const originalError = new Error('REFRESH_FAILED');
    fetchMock.mockRejectOnce(originalError);

    await expect(fetchWithTimeout(TEST_URL)).rejects.toBe(originalError);
  });

  it('호출부 signal로 취소하면 NetworkError가 아닌 원본 AbortError를 전파한다', async () => {
    jest.useFakeTimers();
    mockHangingFetch();

    const controller = new AbortController();
    const promise = fetchWithTimeout(TEST_URL, { signal: controller.signal });

    controller.abort();

    let caught: unknown;
    try {
      await promise;
    } catch (error) {
      caught = error;
    }

    expect(caught).toBeInstanceOf(DOMException);
    expect((caught as DOMException).name).toBe('AbortError');
    expect(caught).not.toBeInstanceOf(NetworkError);
  });
});

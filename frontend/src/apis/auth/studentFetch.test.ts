import { STORAGE_KEYS } from '@/constants/storageKeys';

// constants/api가 import.meta를 쓰는데 jest에서 파싱되지 않는다
jest.mock('@/constants/api', () => ({
  __esModule: true,
  default: 'http://localhost:3000',
}));

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });

const issued = (accessToken: string) =>
  jsonResponse({ statuscode: '200', message: 'ok', data: { accessToken } });

const authHeaderOf = (call: [RequestInfo, RequestInit?]) =>
  (call[1]?.headers as Record<string, string>)?.Authorization;

let fetchMock: jest.Mock;
let studentFetch: (typeof import('./studentFetch'))['studentFetch'];

beforeEach(async () => {
  localStorage.clear();
  delete window.__MOADONG_STUDENT_TOKEN__;

  // 거부된 주입 토큰을 모듈 변수로 들고 있어 테스트마다 새로 불러와야 한다
  jest.resetModules();
  ({ studentFetch } = await import('./studentFetch'));

  fetchMock = jest.fn().mockResolvedValue(jsonResponse({ ok: true }));
  global.fetch = fetchMock as unknown as typeof fetch;
});

describe('studentFetch', () => {
  describe('토큰 선택 순서', () => {
    it('앱이 주입한 토큰을 가장 먼저 쓴다', async () => {
      window.__MOADONG_STUDENT_TOKEN__ = 'app-token';
      localStorage.setItem(STORAGE_KEYS.STUDENT_ACCESS_TOKEN, 'web-token');

      await studentFetch('/api/student/feedback/sent');

      expect(authHeaderOf(fetchMock.mock.calls[0])).toBe('Bearer app-token');
      // 주입 토큰이 있으면 발급을 부르지 않는다
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    it('주입이 없으면 저장된 토큰을 쓴다', async () => {
      localStorage.setItem(STORAGE_KEYS.STUDENT_ACCESS_TOKEN, 'web-token');

      await studentFetch('/api/student/feedback/sent');

      expect(authHeaderOf(fetchMock.mock.calls[0])).toBe('Bearer web-token');
    });

    it('둘 다 없으면 새로 발급받는다', async () => {
      fetchMock
        .mockResolvedValueOnce(issued('new-token'))
        .mockResolvedValueOnce(jsonResponse({ ok: true }));

      await studentFetch('/api/student/feedback/sent');

      expect(fetchMock.mock.calls[0][0]).toContain('/auth/student');
      expect(authHeaderOf(fetchMock.mock.calls[1])).toBe('Bearer new-token');
      expect(localStorage.getItem(STORAGE_KEYS.STUDENT_ACCESS_TOKEN)).toBe(
        'new-token',
      );
    });
  });

  describe('401 재시도', () => {
    it('저장된 토큰이 거부되면 재발급해 다시 보낸다', async () => {
      localStorage.setItem(STORAGE_KEYS.STUDENT_ACCESS_TOKEN, 'stale');
      fetchMock
        .mockResolvedValueOnce(jsonResponse({}, 401))
        .mockResolvedValueOnce(issued('fresh'))
        .mockResolvedValueOnce(jsonResponse({ ok: true }));

      await studentFetch('/api/student/feedback/sent');

      expect(authHeaderOf(fetchMock.mock.calls[2])).toBe('Bearer fresh');
    });

    // 저장분은 앱과 무관한 옛 토큰이라 재시도해도 같이 실패한다
    it('주입 토큰이 거부되면 저장분을 재사용하지 않고 새로 발급한다', async () => {
      window.__MOADONG_STUDENT_TOKEN__ = 'app-token';
      localStorage.setItem(STORAGE_KEYS.STUDENT_ACCESS_TOKEN, 'old-web-token');
      fetchMock
        .mockResolvedValueOnce(jsonResponse({}, 401))
        .mockResolvedValueOnce(issued('fresh'))
        .mockResolvedValueOnce(jsonResponse({ ok: true }));

      await studentFetch('/api/student/feedback/sent');

      expect(fetchMock.mock.calls[1][0]).toContain('/auth/student');
      expect(authHeaderOf(fetchMock.mock.calls[2])).toBe('Bearer fresh');
    });

    // 매번 재발급하면 발급마다 신원이 갈려 방금 보낸 편지가 다음 조회에서 안 보인다
    it('거부된 주입 토큰은 다음 요청에서 다시 쓰지 않는다', async () => {
      window.__MOADONG_STUDENT_TOKEN__ = 'app-token';
      fetchMock
        .mockResolvedValueOnce(jsonResponse({}, 401))
        .mockResolvedValueOnce(issued('fresh'))
        .mockResolvedValueOnce(jsonResponse({ ok: true }));

      await studentFetch('/api/student/feedback/sent');
      fetchMock.mockClear();

      await studentFetch('/api/student/feedback/received');

      // 주입 토큰을 건너뛰고 방금 발급받은 토큰으로 한 번에 나간다
      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(authHeaderOf(fetchMock.mock.calls[0])).toBe('Bearer fresh');
    });

    it('앱이 새 토큰을 주입하면 다시 그것을 우선 쓴다', async () => {
      window.__MOADONG_STUDENT_TOKEN__ = 'app-token';
      fetchMock
        .mockResolvedValueOnce(jsonResponse({}, 401))
        .mockResolvedValueOnce(issued('fresh'))
        .mockResolvedValueOnce(jsonResponse({ ok: true }));
      await studentFetch('/api/student/feedback/sent');

      window.__MOADONG_STUDENT_TOKEN__ = 'app-token-2';
      fetchMock.mockClear();
      await studentFetch('/api/student/feedback/received');

      expect(authHeaderOf(fetchMock.mock.calls[0])).toBe('Bearer app-token-2');
    });
  });
});

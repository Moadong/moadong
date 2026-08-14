import { STORAGE_KEYS } from '@/constants/storageKeys';
import { studentFetch } from './studentFetch';

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

beforeEach(() => {
  localStorage.clear();
  delete window.__MOADONG_STUDENT_TOKEN__;

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
  });
});

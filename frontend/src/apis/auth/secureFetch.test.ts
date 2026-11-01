import { STORAGE_KEYS } from '@/constants/storageKeys';
import { secureFetch } from './secureFetch';

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

let fetchMock: jest.Mock;

beforeEach(() => {
  localStorage.clear();
  localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, 'expired');
  fetchMock = jest.fn();
  global.fetch = fetchMock as unknown as typeof fetch;
});

describe('secureFetch', () => {
  it('401이면 토큰을 갱신하고 새 토큰으로 다시 보낸다', async () => {
    fetchMock
      .mockResolvedValueOnce(jsonResponse({}, 401))
      .mockResolvedValueOnce(jsonResponse({ data: { accessToken: 'fresh' } }))
      .mockResolvedValueOnce(jsonResponse({ ok: true }));

    const response = await secureFetch('http://localhost:3000/api/x');

    expect(response.status).toBe(200);
    expect(localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)).toBe('fresh');
    expect(
      new Headers(fetchMock.mock.calls[2][1]?.headers).get('Authorization'),
    ).toBe('Bearer fresh');
  });

  it('갱신은 됐는데 재요청이 네트워크 오류로 실패하면 새 토큰을 지우지 않는다', async () => {
    fetchMock
      .mockResolvedValueOnce(jsonResponse({}, 401))
      .mockResolvedValueOnce(jsonResponse({ data: { accessToken: 'fresh' } }))
      .mockRejectedValueOnce(new TypeError('Failed to fetch'));

    const error = await secureFetch('http://localhost:3000/api/x').catch(
      (e: Error) => e,
    );

    expect(error).toBeInstanceOf(Error);
    expect((error as Error).message).not.toMatch(/^REFRESH_FAILED/);
    expect(localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)).toBe('fresh');
  });

  it('갱신 자체가 실패하면 토큰을 지우고 REFRESH_FAILED로 던진다', async () => {
    fetchMock
      .mockResolvedValueOnce(jsonResponse({}, 401))
      .mockResolvedValueOnce(jsonResponse({}, 401));

    await expect(secureFetch('http://localhost:3000/api/x')).rejects.toThrow(
      /^REFRESH_FAILED/,
    );
    expect(localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)).toBeNull();
  });
});

import { STORAGE_KEYS } from '@/constants/storageKeys';

jest.mock('@/constants/api', () => ({
  __esModule: true,
  default: 'http://localhost:3000',
}));

jest.mock('@/constants/oauthClient', () => ({
  KAKAO_CLIENT_ID: 'test-kakao-client-id',
  GOOGLE_CLIENT_ID: 'test-google-client-id',
}));

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });

let fetchMock: jest.Mock;
let getStudentOAuthUrl: (typeof import('./studentAuth'))['getStudentOAuthUrl'];
let exchangeStudentOAuthCode: (typeof import('./studentAuth'))['exchangeStudentOAuthCode'];

beforeEach(async () => {
  sessionStorage.clear();

  Object.defineProperty(globalThis.crypto, 'randomUUID', {
    value: jest.fn().mockReturnValue('aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee'),
    configurable: true,
    writable: true,
  });

  jest.resetModules();
  ({ getStudentOAuthUrl, exchangeStudentOAuthCode } = await import(
    './studentAuth'
  ));

  fetchMock = jest.fn().mockResolvedValue(jsonResponse({ ok: true }));
  global.fetch = fetchMock as unknown as typeof fetch;
});

describe('getStudentOAuthUrl', () => {
  it('kakao URL에 client_id, redirect_uri, response_type, state가 포함된다', () => {
    const url = new URL(getStudentOAuthUrl('kakao'));

    expect(url.origin + url.pathname).toBe(
      'https://kauth.kakao.com/oauth/authorize',
    );
    expect(url.searchParams.get('client_id')).toBe('test-kakao-client-id');
    expect(url.searchParams.get('redirect_uri')).toContain('/login/callback');
    expect(url.searchParams.get('response_type')).toBe('code');
    expect(url.searchParams.get('state')).toBeTruthy();
  });

  it('google URL에 client_id, redirect_uri, response_type, scope, state가 포함된다', () => {
    const url = new URL(getStudentOAuthUrl('google'));

    expect(url.origin + url.pathname).toBe(
      'https://accounts.google.com/o/oauth2/v2/auth',
    );
    expect(url.searchParams.get('client_id')).toBe('test-google-client-id');
    expect(url.searchParams.get('redirect_uri')).toContain('/login/callback');
    expect(url.searchParams.get('response_type')).toBe('code');
    expect(url.searchParams.get('scope')).toBe('openid');
    expect(url.searchParams.get('state')).toBeTruthy();
  });

  it('state를 sessionStorage에 저장한다', () => {
    const url = new URL(getStudentOAuthUrl('kakao'));
    const state = url.searchParams.get('state');

    expect(sessionStorage.getItem(STORAGE_KEYS.STUDENT_OAUTH_STATE)).toBe(
      state,
    );
  });
});

describe('exchangeStudentOAuthCode', () => {
  it('accessToken이 없으면 에러를 던진다', async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse({ statuscode: '200', message: 'ok', data: {} }),
    );

    await expect(
      exchangeStudentOAuthCode('kakao', 'some-code'),
    ).rejects.toThrow('accessToken이 없습니다.');
  });

  it('accessToken이 있으면 반환한다', async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse({
        statuscode: '200',
        message: 'ok',
        data: { accessToken: 'token-123', isNewUser: false },
      }),
    );

    const result = await exchangeStudentOAuthCode('kakao', 'some-code');

    expect(result.accessToken).toBe('token-123');
    expect(result.isNewUser).toBe(false);
  });
});

import API_BASE_URL from '@/constants/api';
import { GOOGLE_CLIENT_ID, KAKAO_CLIENT_ID } from '@/constants/oauthClient';
import { STORAGE_KEYS } from '@/constants/storageKeys';
import { handleResponse } from './utils/apiHelpers';
import { fetchWithTimeout } from './utils/fetchWithTimeout';

export type OAuthProvider = 'kakao' | 'google';

interface OAuthCallbackResponse {
  accessToken: string;
  isNewUser: boolean;
}

const STUDENT_OAUTH_REDIRECT_URI = `${window.location.origin}/login/callback`;

interface OAuthProviderConfig {
  authUrl: string;
  clientId: string;
  extraParams?: Record<string, string>;
}

const OAUTH_PROVIDERS: Record<OAuthProvider, OAuthProviderConfig> = {
  kakao: {
    authUrl: 'https://kauth.kakao.com/oauth/authorize',
    clientId: KAKAO_CLIENT_ID,
  },
  google: {
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    clientId: GOOGLE_CLIENT_ID,
    extraParams: { scope: 'openid' },
  },
};

export const getStudentOAuthUrl = (provider: OAuthProvider): string => {
  const state = crypto.randomUUID();
  sessionStorage.setItem(STORAGE_KEYS.STUDENT_OAUTH_STATE, state);

  const { authUrl, clientId, extraParams = {} } = OAUTH_PROVIDERS[provider];
  const params = new URLSearchParams({
    redirect_uri: STUDENT_OAUTH_REDIRECT_URI,
    response_type: 'code',
    state,
    client_id: clientId,
    ...extraParams,
  });

  return `${authUrl}?${params}`;
};

export const exchangeStudentOAuthCode = async (
  provider: OAuthProvider,
  code: string,
): Promise<OAuthCallbackResponse> => {
  const response = await fetchWithTimeout(
    `${API_BASE_URL}/auth/student/oauth/${provider}/callback`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, redirectUri: STUDENT_OAUTH_REDIRECT_URI }),
    },
  );
  const data = await handleResponse<OAuthCallbackResponse>(
    response,
    '소셜 로그인에 실패했습니다.',
  );
  if (!data?.accessToken) {
    throw new Error('accessToken이 없습니다.');
  }
  return data;
};

export const logoutStudentOAuth = async (): Promise<void> => {
  const accessToken = localStorage.getItem(
    STORAGE_KEYS.STUDENT_LOGIN_ACCESS_TOKEN,
  );
  if (!accessToken) return;

  const response = await fetchWithTimeout(
    `${API_BASE_URL}/auth/student/oauth/logout`,
    {
      method: 'GET',
      credentials: 'include',
    },
  );
  await handleResponse(response, '로그아웃에 실패했습니다.');
};

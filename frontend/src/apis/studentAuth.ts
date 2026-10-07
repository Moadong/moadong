import API_BASE_URL from '@/constants/api';
import { STORAGE_KEYS } from '@/constants/storageKeys';
import { handleResponse } from './utils/apiHelpers';
import { fetchWithTimeout } from './utils/fetchWithTimeout';

export type OAuthProvider = 'kakao' | 'google';

interface OAuthAuthorizeResponse {
  redirectUrl: string;
}

interface OAuthCallbackResponse {
  accessToken: string;
  isNewUser: boolean;
}

export const fetchStudentOAuthUrl = async (
  provider: OAuthProvider,
): Promise<string> => {
  const response = await fetchWithTimeout(
    `${API_BASE_URL}/auth/student/oauth/${provider}`,
    { method: 'GET' },
  );
  const data = await handleResponse<OAuthAuthorizeResponse>(
    response,
    `${provider} 로그인 URL 조회에 실패했습니다.`,
  );
  if (!data?.redirectUrl) {
    throw new Error('로그인 URL이 비어있습니다.');
  }
  return data.redirectUrl;
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
      body: JSON.stringify({ code }),
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

  await fetchWithTimeout(`${API_BASE_URL}/auth/student/oauth/logout`, {
    method: 'GET',
    credentials: 'include',
  });

  localStorage.removeItem(STORAGE_KEYS.STUDENT_LOGIN_ACCESS_TOKEN);
};

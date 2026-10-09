import API_BASE_URL from '@/constants/api';
import { STORAGE_KEYS } from '@/constants/storageKeys';
import { handleResponse } from './utils/apiHelpers';
import { fetchWithTimeout } from './utils/fetchWithTimeout';

export type OAuthProvider = 'kakao' | 'google';

export const STUDENT_OAUTH_STATE_KEY = 'student_oauth_state';

interface OAuthCallbackResponse {
  accessToken: string;
  isNewUser: boolean;
}

const STUDENT_OAUTH_REDIRECT_URI = `${window.location.origin}/login/callback`;

export const getStudentOAuthUrl = (provider: OAuthProvider): string => {
  const state = crypto.randomUUID();
  sessionStorage.setItem(STUDENT_OAUTH_STATE_KEY, state);

  const params = new URLSearchParams({
    redirect_uri: STUDENT_OAUTH_REDIRECT_URI,
    response_type: 'code',
    state,
  });

  if (provider === 'kakao') {
    params.set('client_id', import.meta.env.VITE_KAKAO_CLIENT_ID);
    return `https://kauth.kakao.com/oauth/authorize?${params}`;
  }

  params.set('client_id', import.meta.env.VITE_GOOGLE_CLIENT_ID);
  params.set('scope', 'openid');
  return `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
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

  await fetchWithTimeout(`${API_BASE_URL}/auth/student/oauth/logout`, {
    method: 'GET',
    credentials: 'include',
  });
};

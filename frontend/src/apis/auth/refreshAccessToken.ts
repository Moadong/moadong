import API_BASE_URL from '@/constants/api';

export const refreshAccessToken = async (): Promise<string> => {
  const res = await fetch(`${API_BASE_URL}/auth/user/refresh`, {
    method: 'POST',
    credentials: 'include',
  });

  // refresh 성공하여 accessToken 반환
  if (res.status === 200) {
    const { data } = await res.json();
    return data.accessToken;
  }

  // refresh 실패 or 만료
  throw new Error('REFRESH_FAILED');
};

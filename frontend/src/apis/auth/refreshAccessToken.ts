import API_BASE_URL from '@/constants/api';

export const refreshAccessToken = async (): Promise<string> => {
  const res = await fetch(`${API_BASE_URL}/auth/user/refresh`, {
    method: 'POST',
    credentials: 'include',
  });

  if (res.status === 200) {
    const { data } = await res.json();
    return data.accessToken;
  }

  throw new Error('REFRESH_FAILED');
};

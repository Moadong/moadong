import { fetchWithTimeout } from '@/apis/utils/fetchWithTimeout';
import API_BASE_URL from '@/constants/api';

export const refreshAccessToken = async (): Promise<string> => {
  const res = await fetchWithTimeout(`${API_BASE_URL}/auth/user/refresh`, {
    method: 'POST',
    credentials: 'include',
  });

  if (res.status === 200) {
    const { data } = await res.json();
    return data.accessToken;
  }

  throw new Error('REFRESH_FAILED');
};

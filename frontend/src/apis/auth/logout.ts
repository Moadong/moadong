import API_BASE_URL from '@/constants/api';
import { secureFetch } from '@/apis/auth/secureFetch';

export const logout = async (): Promise<void> => {
  const response = await secureFetch(`${API_BASE_URL}/auth/user/logout`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(`로그아웃에 실패하였습니다: ${response.statusText}`);
  }
};

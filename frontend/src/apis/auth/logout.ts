import API_BASE_URL from '@/constants/api';

export const logout = async (): Promise<void> => {
  const accessToken = localStorage.getItem('accessToken');

  if (!accessToken) {
    return;
  }

  const response = await fetch(`${API_BASE_URL}/auth/user/logout`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(`로그아웃에 실패하였습니다 ${response.statusText}`);
  }
};

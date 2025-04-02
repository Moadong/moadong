import API_BASE_URL from '@/constants/api';
import { secureFetch } from '@/apis/auth/secureFetch';

export const deleteClubLogo = async (clubId: string) => {
  const response = await secureFetch(
    `${API_BASE_URL}/api/club/${clubId}/logo`,
    {
      method: 'DELETE',
    },
  );

  if (!response.ok) {
    throw new Error('로고 삭제 실패');
  }

  return await response.json();
};

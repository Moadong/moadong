import { secureFetch } from '@/apis/auth/secureFetch';
import API_BASE_URL from '@/constants/api';

export const getClubIdByToken = async (): Promise<string> => {
  const response = await secureFetch(`${API_BASE_URL}/auth/user/find/club`, {
    method: 'POST',
  });

  if (!response.ok) throw new Error('Unauthorized');

  const { data } = await response.json();
  return data.clubId;
};

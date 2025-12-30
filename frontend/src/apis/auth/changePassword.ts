import API_BASE_URL from '@/constants/api';
import { secureFetch } from './secureFetch';

interface ChangePasswordPayload {
  password: string;
}

export const changePassword = async (
  payload: ChangePasswordPayload,
): Promise<void> => {
  const response = await secureFetch(`${API_BASE_URL}/auth/user/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || '비밀번호 변경에 실패했습니다.');
  }
};

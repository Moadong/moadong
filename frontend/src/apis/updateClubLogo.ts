import API_BASE_URL from '@/constants/api';
import { secureFetch } from '@/apis/auth/secureFetch';

export const uploadClubLogo = async (clubId: string, file: File) => {
  const formData = new FormData();
  formData.append('logo', file);

  const response = await secureFetch(
    `${API_BASE_URL}/api/club/${clubId}/logo`,
    {
      method: 'POST',
      body: formData,
    },
  );

  if (!response.ok) {
    throw new Error('로고 업로드 실패');
  }

  return await response.json();
};

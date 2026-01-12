import API_BASE_URL from '@/constants/api';
import { secureFetch } from '../auth/secureFetch';

export const duplicateApplication = async (applicationFormId: string) => {
  try {
    const response = await secureFetch(
      `${API_BASE_URL}/api/club/application/${applicationFormId}/duplicate`,
      {
        method: 'POST',
      },
    );
    if (!response.ok) {
      throw new Error('지원서 복제에 실패했습니다.');
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('지원서 복제 중 오류 발생:', error);
    throw error;
  }
};

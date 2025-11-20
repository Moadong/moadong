import API_BASE_URL from '@/constants/api';
import { secureFetch } from '@/apis/auth/secureFetch';
import { ApplicationFormData } from '@/types/application';

export const createApplication = async (data: ApplicationFormData) => {
  try {
    const response = await secureFetch(`${API_BASE_URL}/api/club/application`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('지원서 제출에 실패했습니다.');
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('지원서 제출 중 오류 발생:', error);
    throw error;
  }
};

export default createApplication;

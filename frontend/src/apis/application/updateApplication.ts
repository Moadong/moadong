import { secureFetch } from '@/apis/auth/secureFetch';
import API_BASE_URL from '@/constants/api';
import { ApplicationFormData } from '@/types/application';

export const updateApplication = async (
  data: ApplicationFormData,
  applicationFormId: string,
) => {
  try {
    const response = await secureFetch(
      `${API_BASE_URL}/api/club/application/${applicationFormId}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      },
    );

    if (!response.ok) {
      throw new Error('지원서 수정에 실패했습니다.');
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('지원서 수정 중 오류 발생:', error);
    throw error;
  }
};

export const updateApplicationStatus = async (
  applicationFormId: string,
  currentStatus: string,
) => {
  const newStatus = currentStatus === 'ACTIVE' ? false : true;
  try {
    const response = await secureFetch(
      `${API_BASE_URL}/api/club/application/${applicationFormId}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ active: newStatus }),
      },
    );
    if (!response.ok) {
      throw new Error('지원서 상태 수정에 실패했습니다.');
    }
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('지원서 상태 수정 중 오류 발생:', error);
    throw error;
  }
};

import API_BASE_URL from '@/constants/api';
import { AnswerItem } from '@/types/application';

export const applyToClub = async (
  clubId: string,
  applicationFormId: string,
  answers: AnswerItem[],
) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/club/${clubId}/apply/${applicationFormId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          questions: [
            ...answers
          ]
         }),
      },
    );

    if (!response.ok) {
      throw new Error('답변 제출에 실패했습니다.');
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('답변 제출 중 오류 발생:', error);
    throw error;
  }
};

export default applyToClub; 
import { secureFetch } from '@/apis/auth/secureFetch';
import API_BASE_URL from '@/constants/api';
import { ClubDescription } from '@/types/club';

export const updateClubDescription = async (
  updatedData: ClubDescription,
): Promise<void> => {
  const response = await secureFetch(`${API_BASE_URL}/api/club/description`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedData),
  });

  if (!response.ok) {
    let errorMessage = `Failed to update club (HTTP ${response.status})`;

    try {
      const errorResult = await response.json();
      if (errorResult?.message) {
        errorMessage += `: ${errorResult.message}`;
      }
    } catch (error) {
      console.error('📌 오류 응답 JSON 파싱 실패:', error);
    }

    throw new Error(errorMessage);
  }

  try {
    await response.json();
  } catch (error) {
    console.error('📌 JSON 파싱 실패:', error);
    throw new Error('Invalid JSON response from API');
  }
};

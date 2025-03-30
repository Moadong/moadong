import API_BASE_URL from '@/constants/api';
import { ClubDetail } from '@/types/club';

export const updateClubDetail = async (
  updatedData: Partial<ClubDetail>,
): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/api/club/info`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedData),
  });

  let result;
  try {
    result = await response.json();
  } catch (error) {
    console.error('📌 JSON 파싱 실패:', error);
    result = null;
  }

  if (!response.ok) {
    const errorMessage = result?.message
      ? `Failed to update club (HTTP ${response.status}): ${result.message}`
      : `Failed to update club (HTTP ${response.status})`;

    throw new Error(errorMessage);
  }

  if (!result?.data) {
    console.error('📌 API 응답에 data 필드가 없음:', result);
    throw new Error('Unexpected API response: Missing data field');
  }
};

import API_BASE_URL from '@/constants/api';
import { ClubDetail } from '@/types/club';

export const getClubDetail = async (clubId: string): Promise<ClubDetail> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/club/${clubId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data.club;
  } catch (error) {
    console.error('Error fetching club details', error);
    throw error;
  }
};

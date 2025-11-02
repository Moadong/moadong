import API_BASE_URL from '@/constants/api';
import { secureFetch } from '../auth/secureFetch';

const getClubApplicants = async (applicationFormId: string) => {
  try {
    const response = await secureFetch(`${API_BASE_URL}/api/club/apply/info/${applicationFormId}`);
    if (!response.ok) {
      console.error(`Failed to fetch: ${response.statusText}`)
      throw new Error((await response.json()).message);
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error fetching club applicants', error);
    throw error;
  }
};

export default getClubApplicants;

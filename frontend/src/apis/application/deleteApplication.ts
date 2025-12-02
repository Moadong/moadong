import API_BASE_URL from '@/constants/api';
import { secureFetch } from '../auth/secureFetch';

const deleteApplication = async (
  applicationFormId: string,
) => {
  try {
    const response = await secureFetch(`${API_BASE_URL}/api/club/application/${applicationFormId}`, {
        method: 'DELETE',
      },
    );
    if (!response.ok) {
      console.error(`Failed to delete: ${response.statusText}`);
      throw new Error((await response.json()).message);
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error fetching delete application', error);
    throw error;
  }
};

export default deleteApplication;

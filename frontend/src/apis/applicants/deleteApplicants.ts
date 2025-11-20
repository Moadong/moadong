import API_BASE_URL from '@/constants/api';
import { secureFetch } from '../auth/secureFetch';

const deleteApplicants = async (
  applicantIds: string[],
  applicationFormId: string,
) => {
  try {
    const response = await secureFetch(`${API_BASE_URL}/api/club/applicant/${applicationFormId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ applicantIds: applicantIds }),
      },
    );
    if (!response.ok) {
      console.error(`Failed to fetch: ${response.statusText}`);
      throw new Error((await response.json()).message);
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error fetching delete applicants', error);
    throw error;
  }
};

export default deleteApplicants;

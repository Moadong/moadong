import API_BASE_URL from '@/constants/api';
import { secureFetch } from './auth/secureFetch';
import { handleResponse, withErrorHandling } from './utils/apiHelpers';

export const getClubApplicants = async (applicationFormId: string) => {
  return withErrorHandling(async () => {
    const response = await secureFetch(
      `${API_BASE_URL}/api/club/apply/info/${applicationFormId}`,
    );
    return handleResponse(response);
  }, 'Error fetching club applicants');
};

export const deleteApplicants = async (
  applicantIds: string[],
  applicationFormId: string,
) => {
  return withErrorHandling(async () => {
    const response = await secureFetch(
      `${API_BASE_URL}/api/club/applicant/${applicationFormId}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ applicantIds: applicantIds }),
      },
    );
    return handleResponse(response);
  }, 'Error fetching delete applicants');
};

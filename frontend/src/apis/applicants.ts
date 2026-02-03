import API_BASE_URL from '@/constants/api';
import { ApplicantsInfo } from '@/types/applicants';
import { secureFetch } from './auth/secureFetch';
import { handleResponse } from './utils/apiHelpers';

export const getClubApplicants = async (
  applicationFormId: string,
): Promise<ApplicantsInfo | undefined> => {
  const response = await secureFetch(
    `${API_BASE_URL}/api/club/apply/info/${applicationFormId}`,
  );
  return handleResponse<ApplicantsInfo>(
    response,
    '지원자 목록을 불러오는데 실패했습니다.',
  );
};

export const deleteApplicants = async (
  applicantIds: string[],
  applicationFormId: string,
) => {
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
  return handleResponse(response, '지원자 삭제에 실패했습니다.');
};

import API_BASE_URL from '@/constants/api';
import { secureFetch } from '@/apis/auth/secureFetch';
import { ApplicationStatus } from '@/types/applicants';

export const updateApplicantDetail = async (
  memo: string,
  status: ApplicationStatus,
  clubId: string,
  applicantId: string,
) => {
  try {
    const response = await secureFetch(
      `${API_BASE_URL}/api/club/${clubId}/apply/${applicantId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          memo,
          status
        })
      },
    );

    if (!response.ok) {
      throw new Error('지원자의 지원서 정보 수정에 실패했습니다.');
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('지원자의 지원서 정보 수정 중 오류 발생:', error);
    throw error;
  }
};

export default updateApplicantDetail;

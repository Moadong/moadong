import API_BASE_URL from '@/constants/api';
import { ApplicationFormData } from '@/types/application';

const getApplication = async (
  clubId: string,
  applicationFormId: string,
): Promise<ApplicationFormData> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/club/${clubId}/apply/${applicationFormId}`,
    );
    if (!response.ok) {
      let message = response.statusText;
      try {
        const errorData = await response.json();
        if (errorData?.message) message = errorData.message;
      } catch {}
      console.error(`Failed to fetch: ${message}`);
      throw new Error(message);
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    // [x] FIXME:
    // {"statuscode":"800-1","message":"지원서가 존재하지 않습니다.","data":null}
    console.error('지원서 조회 중 오류가 발생했습니다', error);
    throw error;
  }
};

export default getApplication;

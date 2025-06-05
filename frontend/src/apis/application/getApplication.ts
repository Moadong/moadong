import API_BASE_URL from '@/constants/api';

const getApplication = async (clubId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/club/${clubId}/apply`);
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    // [x] FIXME:
    // {"statuscode":"800-1","message":"지원서가 존재하지 않습니다.","data":null}
    console.error('Error fetching club details', error);
    throw error;
  }
};

export default getApplication;

import API_BASE_URL from '@/constants/api';

const getActiveApplications = async (clubId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/club/${clubId}/apply`);

    if (!response.ok) {
      console.error(`Failed to fetch: ${response.statusText}`);
      throw new Error((await response.json()).message);
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('활성화된 지원서 목록 조회 중 오류 발생:', error);
    throw error;
  }
};

export default getActiveApplications;

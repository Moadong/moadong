import API_BASE_URL from '@/constants/api';
import { secureFetch } from '@/apis/auth/secureFetch';

const getAllApplicationForms = async () => {
  try {
    const response = await secureFetch(
      `${API_BASE_URL}/api/club/application`,
    );

    if (!response.ok) {
      console.error(`Failed to fetch: ${response.statusText}`);
      throw new Error((await response.json()).message);
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('모든 지원서 양식 조회 중 오류 발생:', error);
    throw error;
  }
};

export default getAllApplicationForms;

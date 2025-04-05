import API_BASE_URL from '@/constants/api';
import { secureFetch } from '@/apis/auth/secureFetch';
import { MAX_FILE_SIZE } from '@/constants/uploadLimit';

export const createFeedImage = async (file: File, clubId: string) => {
  try {
    if (file.size > MAX_FILE_SIZE) {
      throw new Error('파일 크기가 10MB를 초과합니다.');
    }

    const formData = new FormData();
    formData.append('feed', file);

    const response = await secureFetch(
      `${API_BASE_URL}/api/club/${clubId}/feed`,
      {
        method: 'POST',
        body: formData,
      },
    );
    if (!response.ok) {
      throw new Error('피드 정보 갱신에 실패했습니다');
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('피드 정보 갱신에 실패했습니다', error);
    throw error;
  }
};

export default createFeedImage;

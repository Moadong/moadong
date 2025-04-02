import API_BASE_URL from '@/constants/api';

export const updateFeedImages = async (feeds: string[], clubId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/club/${clubId}/feeds`, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({ feeds }),
    });
    if (!response.ok) {
      throw new Error('피드 이미지 업로드에 실패했습니다');
    }
  } catch (error) {
    console.error('피드 이미지 업로드에 실패했습니다', error);
    throw error;
  }
};

export default updateFeedImages;

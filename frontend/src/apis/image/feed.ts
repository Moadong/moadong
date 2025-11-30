import API_BASE_URL from '@/constants/api';
import { secureFetch } from '@/apis/auth/secureFetch';

interface FeedUploadRequest {
  fileName: string;
  contentType: string;
}

interface PresignedData {
  presignedUrl: string;
  finalUrl: string;
}

export const feedApi = {
  getUploadUrls: async (
    clubId: string,
    uploadRequests: FeedUploadRequest[],
  ): Promise<PresignedData[]> => {
    const response = await secureFetch(
      `${API_BASE_URL}/api/club/${clubId}/feed/upload-url`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(uploadRequests),
      },
    );

    if (!response.ok) {
      throw new Error(`피드 업로드 URL 생성 실패 : ${response.status}`);
    }

    const result = await response.json();
    return result.data;
  },

  updateFeeds: async (clubId: string, feedUrls: string[]): Promise<void> => {
    const response = await secureFetch(
      `${API_BASE_URL}/api/club/${clubId}/feeds`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feeds: feedUrls }),
      },
    );

    if (!response.ok) {
      throw new Error(`피드 업데이트 실패 : ${response.status}`);
    }
  },
};

import API_BASE_URL from '@/constants/api';
import { secureFetch } from '@/apis/auth/secureFetch';

interface PresignedData {
  presignedUrl: string;
  finalUrl: string;
}

export const coverApi = {
  getUploadUrl: async (
    clubId: string,
    fileName: string,
    contentType: string,
  ): Promise<PresignedData> => {
    const response = await secureFetch(
      `${API_BASE_URL}/api/club/${clubId}/cover/upload-url`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName, contentType }),
      },
    );

    if (!response.ok) {
      throw new Error(`커버 업로드 URL 생성 실패 : ${response.status}`);
    }

    const result = await response.json();
    return result.data;
  },

  completeUpload: async (clubId: string, fileUrl: string): Promise<void> => {
    const response = await secureFetch(
      `${API_BASE_URL}/api/club/${clubId}/cover/complete`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileUrl }),
      },
    );

    if (!response.ok) {
      throw new Error(`커버 업로드 완료 처리 실패 : ${response.status}`);
    }
  },

  delete: async (clubId: string): Promise<void> => {
    const response = await secureFetch(
      `${API_BASE_URL}/api/club/${clubId}/cover`,
      {
        method: 'DELETE',
      },
    );

    if (!response.ok) {
      throw new Error(`커버 삭제 실패: ${response.status}`);
    }
  },
};

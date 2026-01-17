import { secureFetch } from './auth/secureFetch';
import API_BASE_URL from '@/constants/api';
import { handleResponse, withErrorHandling } from './utils/apiHelpers';

interface PresignedData {
  presignedUrl: string;
  finalUrl: string;
}

interface FeedUploadRequest {
  fileName: string;
  contentType: string;
}

// Storage 업로드
export async function uploadToStorage(
  presignedUrl: string,
  file: File,
): Promise<void> {
  return withErrorHandling(async () => {
    const response = await fetch(presignedUrl, {
      method: 'PUT',
      body: file,
      headers: { 'Content-Type': file.type },
    });
    await handleResponse(response, `S3 업로드 실패 : ${response.status}`);
  }, 'S3 업로드 중 오류 발생');
}

// Cover API
export const coverApi = {
  getUploadUrl: async (
    clubId: string,
    fileName: string,
    contentType: string,
  ): Promise<PresignedData> => {
    return withErrorHandling(async () => {
      const response = await secureFetch(
        `${API_BASE_URL}/api/club/${clubId}/cover/upload-url`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fileName, contentType }),
        },
      );
      return handleResponse(response, `커버 업로드 URL 생성 실패 : ${response.status}`);
    }, '커버 업로드 URL 생성 중 오류 발생');
  },

  completeUpload: async (clubId: string, fileUrl: string): Promise<void> => {
    return withErrorHandling(async () => {
      const response = await secureFetch(
        `${API_BASE_URL}/api/club/${clubId}/cover/complete`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fileUrl }),
        },
      );
      await handleResponse(response, `커버 업로드 완료 처리 실패 : ${response.status}`);
    }, '커버 업로드 완료 처리 중 오류 발생');
  },

  delete: async (clubId: string): Promise<void> => {
    return withErrorHandling(async () => {
      const response = await secureFetch(
        `${API_BASE_URL}/api/club/${clubId}/cover`,
        {
          method: 'DELETE',
        },
      );
      await handleResponse(response, `커버 삭제 실패: ${response.status}`);
    }, '커버 삭제 중 오류 발생');
  },
};

// Feed API
export const feedApi = {
  getUploadUrls: async (
    clubId: string,
    uploadRequests: FeedUploadRequest[],
  ): Promise<PresignedData[]> => {
    return withErrorHandling(async () => {
      const response = await secureFetch(
        `${API_BASE_URL}/api/club/${clubId}/feed/upload-url`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(uploadRequests),
        },
      );
      return handleResponse(response, `피드 업로드 URL 생성 실패 : ${response.status}`);
    }, '피드 업로드 URL 생성 중 오류 발생');
  },

  updateFeeds: async (clubId: string, feedUrls: string[]): Promise<void> => {
    return withErrorHandling(async () => {
      const response = await secureFetch(
        `${API_BASE_URL}/api/club/${clubId}/feeds`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ feeds: feedUrls }),
        },
      );
      await handleResponse(response, `피드 업데이트 실패 : ${response.status}`);
    }, '피드 업데이트 중 오류 발생');
  },
};

// Logo API
export const logoApi = {
  getUploadUrl: async (
    clubId: string,
    fileName: string,
    contentType: string,
  ): Promise<PresignedData> => {
    return withErrorHandling(async () => {
      const response = await secureFetch(
        `${API_BASE_URL}/api/club/${clubId}/logo/upload-url`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fileName, contentType }),
        },
      );
      return handleResponse(response, `업로드 URL 생성 실패 : ${response.status}`);
    }, '로고 업로드 URL 생성 중 오류 발생');
  },

  completeUpload: async (clubId: string, fileUrl: string): Promise<void> => {
    return withErrorHandling(async () => {
      const response = await secureFetch(
        `${API_BASE_URL}/api/club/${clubId}/logo/complete`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fileUrl }),
        },
      );
      await handleResponse(response, `업로드 완료 처리 실패 : ${response.status}`);
    }, '로고 업로드 완료 처리 중 오류 발생');
  },

  delete: async (clubId: string): Promise<void> => {
    return withErrorHandling(async () => {
      const response = await secureFetch(
        `${API_BASE_URL}/api/club/${clubId}/logo`,
        {
          method: 'DELETE',
        },
      );
      await handleResponse(response, `로고 삭제 실패 : ${response.status}`);
    }, '로고 삭제 중 오류 발생');
  },
};

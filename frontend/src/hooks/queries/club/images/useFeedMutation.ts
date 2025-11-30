import { useMutation, useQueryClient } from '@tanstack/react-query';
import { feedApi } from '@/apis/image/feed';
import { uploadToStorage } from '@/apis/image/uploadToStorage';

interface FeedUploadParams {
  clubId: string;
  files: File[];
  existingUrls: string[];
}

interface FeedUpdateParams {
  clubId: string;
  urls: string[];
}

// 피드 업로드(새 파일 업로드 + 기존 피드와 합쳐서 서버 갱신)
export const useUploadFeed = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ clubId, files, existingUrls }: FeedUploadParams) => {
      // 1. presigned URL 요청
      const uploadRequests = files.map((file) => ({
        fileName: file.name,
        contentType: file.type,
      }));
      const feedResArr = await feedApi.getUploadUrls(clubId, uploadRequests);

      // 2. r2에 병렬 업로드
      await Promise.all(
        files.map((file, i) =>
          uploadToStorage(feedResArr[i].presignedUrl, file),
        ),
      );

      // 3. 새로 업로드된 URL 추출
      const newUrls = feedResArr.map((res) => res.finalUrl);

      // 4. 기존 URL과 합쳐서 전체 배열 생성
      const allUrls = [...existingUrls, ...newUrls];

      // 5. 서버에 전체 배열 PUT으로 갱신 (업로드 + 기존 피드 동기화)
      await feedApi.updateFeeds(clubId, allUrls);

      return { clubId };
    },

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['clubDetail', data.clubId] });
    },
    // TODO: 각 API 에러 응답에 따른 세분화된 에러 메시지 전달
    // 참고: feedApi.updateFeeds, uploadToStorage 에러 스펙 확인 후 분기
    onError: () => {
      alert('이미지 업로드에 실패했어요. 다시 시도해주세요!');
    },
  });
};

// 피드 업데이트 (기존 피드 URL 배열만 서버에 갱신)
export const useUpdateFeed = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ clubId, urls }: FeedUpdateParams) => {
      // 1. 서버에 URL 배열 PUT으로 갱신
      await feedApi.updateFeeds(clubId, urls);
      return { clubId };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['clubDetail', data.clubId] });
    },
    // TODO: 각 API 에러 응답에 따른 세분화된 에러 메시지 전달
    onError: () => {
      alert('이미지 수정에 실패했어요. 다시 시도해주세요!');
    },
  });
};

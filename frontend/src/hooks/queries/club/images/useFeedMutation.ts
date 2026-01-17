import { useMutation, useQueryClient } from '@tanstack/react-query';
import { feedApi, uploadToStorage } from '@/apis/image';

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

      // 2. r2에 병렬 업로드 (개별 성공/실패 추적)
      const uploadResults = await Promise.allSettled(
        files.map((file, i) =>
          uploadToStorage(feedResArr[i].presignedUrl, file),
        ),
      );

      // 3. 성공한 파일만 추출
      const successfulUrls: string[] = [];
      const failedFiles: string[] = [];

      uploadResults.forEach((result, i) => {
        if (result.status === 'fulfilled') {
          successfulUrls.push(feedResArr[i].finalUrl);
        } else {
          failedFiles.push(files[i].name);
        }
      });

      // 4. 성공한 파일이 없으면 에러
      if (successfulUrls.length === 0) {
        throw new Error('모든 파일 업로드에 실패했습니다.');
      }

      // 5. 기존 URL과 성공한 URL만 합쳐서 전체 배열 생성
      const allUrls = [...existingUrls, ...successfulUrls];

      // 6. 서버에 전체 배열 PUT으로 갱신
      await feedApi.updateFeeds(clubId, allUrls);

      // 7. 실패한 파일 정보 반환
      return { clubId, failedFiles };
    },

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['clubDetail', data.clubId] });

      // 부분 실패한 경우 사용자에게 알림
      if (data.failedFiles.length > 0) {
        const failedFileNames = data.failedFiles.join(', ');
        alert(
          `일부 파일 업로드에 실패했어요.\n실패한 파일: ${failedFileNames}\n\n성공한 파일은 정상적으로 등록되었어요.`,
        );
      }
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

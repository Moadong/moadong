import { useMutation, useQueryClient } from '@tanstack/react-query';
import { feedApi, logoApi, uploadToStorage } from '@/apis/image';
import { queryKeys } from '@/constants/queryKeys';

interface FeedUploadParams {
  clubId: string;
  files: File[];
  existingUrls: string[];
}

interface FeedUpdateParams {
  clubId: string;
  urls: string[];
}

interface LogoUploadParams {
  clubId: string;
  file: File;
}

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
      queryClient.invalidateQueries({
        queryKey: queryKeys.club.detail(data.clubId),
      });
    },
    onError: () => {
      console.error('Error uploading feed images');
    },
  });
};

export const useUpdateFeed = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ clubId, urls }: FeedUpdateParams) => {
      await feedApi.updateFeeds(clubId, urls);
      return { clubId };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.club.detail(data.clubId),
      });
    },
    onError: () => {
      console.error('Error updating feed images');
    },
  });
};

export const useUploadLogo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ clubId, file }: LogoUploadParams) => {
      // 1. presigned URL 받기
      const { presignedUrl, finalUrl } = await logoApi.getUploadUrl(
        clubId,
        file.name,
        file.type,
      );

      // 2. r2 업로드
      await uploadToStorage(presignedUrl, file);

      // 3. 완료 처리
      await logoApi.completeUpload(clubId, finalUrl);

      return { finalUrl, clubId };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.club.detail(data.clubId),
      });
    },
    onError: () => {
      console.error('Error uploading logo');
    },
  });
};

export const useDeleteLogo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (clubId: string) => {
      await logoApi.delete(clubId);
      return clubId;
    },
    onSuccess: (clubId) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.club.detail(clubId),
      });
    },
    onError: () => {
      console.error('Error deleting logo');
    },
  });
};

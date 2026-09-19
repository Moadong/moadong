import { useMutation, useQueryClient } from '@tanstack/react-query';
import { feedApi, logoApi, uploadToStorage } from '@/apis/image';
import { queryKeys } from '@/constants/queryKeys';
import { ALLOWED_IMAGE_TYPES } from '@/constants/uploadLimit';

type ItemStatus = 'pending' | 'uploading' | 'failed';

interface FeedUploadParams {
  clubId: string;
  files: File[];
  onItemStatusChange?: (file: File, status: ItemStatus) => void;
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
  return useMutation({
    mutationFn: async ({
      clubId,
      files,
      onItemStatusChange,
    }: FeedUploadParams) => {
      // 1. presigned URL 요청
      const uploadRequests = files.map((file) => ({
        fileName: file.name,
        contentType: (ALLOWED_IMAGE_TYPES as readonly string[]).includes(
          file.type,
        )
          ? file.type
          : 'image/jpeg',
      }));
      const feedResArr = await feedApi.getUploadUrls(clubId, uploadRequests);

      if (!feedResArr) {
        throw new Error('피드 업로드 URL 생성 실패');
      }

      // 2. r2에 병렬 업로드 (개별 성공/실패 추적)
      // presigned URL 생성 자체가 실패한 항목은 업로드 건너뜀
      // 서버가 개수 제한에 걸리면 요청보다 짧은 배열을 돌려준다.
      // 인덱스로 매칭하므로 없는 항목도 실패로 처리해야 뒤 파일에서 터지지 않는다.
      const uploadResults = await Promise.allSettled(
        files.map((file, i) => {
          const res = feedResArr[i];
          if (!res?.success || !res.presignedUrl || !res.finalUrl) {
            return Promise.reject(
              new Error(res?.failureReason ?? 'presigned URL 생성 실패'),
            );
          }
          return uploadToStorage(res.presignedUrl, file);
        }),
      );

      // 3. 성공한 파일만 추출 (파일 -> 최종 URL 매핑)
      const urlByFile = new Map<File, string>();
      const failedFiles: string[] = [];

      uploadResults.forEach((result, i) => {
        const finalUrl = feedResArr[i]?.finalUrl;
        if (result.status === 'fulfilled' && finalUrl) {
          urlByFile.set(files[i], finalUrl);
        } else {
          failedFiles.push(files[i].name);
          onItemStatusChange?.(files[i], 'failed');
        }
      });

      // 4. 성공한 파일이 없으면 에러
      if (urlByFile.size === 0) {
        throw new Error('모든 파일 업로드에 실패했습니다.');
      }

      // 5. 저장(updateFeeds)은 호출부가 한다.
      // 화면 순서를 모르는 여기서 배열을 조립하면 새 사진이 항상 뒤로 밀린다.
      return { failedFiles, urlByFile };
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
      const uploadUrlData = await logoApi.getUploadUrl(
        clubId,
        file.name,
        file.type,
      );

      if (!uploadUrlData) {
        throw new Error('로고 업로드 URL 생성 실패');
      }

      const { presignedUrl, finalUrl } = uploadUrlData;

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

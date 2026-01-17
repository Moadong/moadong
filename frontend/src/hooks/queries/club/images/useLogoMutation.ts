import { useMutation, useQueryClient } from '@tanstack/react-query';
import { logoApi, uploadToStorage } from '@/apis/image';

interface LogoUploadParams {
  clubId: string;
  file: File;
}

// 로고 업로드 (presigned URL 발급 → r2 업로드 → 완료 처리)
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
      queryClient.invalidateQueries({ queryKey: ['clubDetail', data.clubId] });
    },
    // TODO: 각 API 에러 응답에 따른 세분화된 에러 메시지 전달
    onError: () => {
      alert('로고 업로드에 실패했어요. 다시 시도해주세요!');
    },
  });
};

// 로고 삭제
export const useDeleteLogo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (clubId: string) => {
      await logoApi.delete(clubId);
      return clubId;
    },
    onSuccess: (clubId) => {
      queryClient.invalidateQueries({ queryKey: ['clubDetail', clubId] });
    },
    // TODO: 각 API 에러 응답에 따른 세분화된 에러 메시지 전달
    onError: () => {
      alert('로고 초기화에 실패했어요. 다시 시도해 주세요.');
    },
  });
};

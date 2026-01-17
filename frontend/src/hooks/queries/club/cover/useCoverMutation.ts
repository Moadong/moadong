import { useMutation, useQueryClient } from '@tanstack/react-query';
import { coverApi, uploadToStorage } from '@/apis/image';

interface CoverUploadParams {
  clubId: string;
  file: File;
}

export const useUploadCover = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ clubId, file }: CoverUploadParams) => {
      const { presignedUrl, finalUrl } = await coverApi.getUploadUrl(
        clubId,
        file.name,
        file.type,
      );

      await uploadToStorage(presignedUrl, file);

      await coverApi.completeUpload(clubId, finalUrl);

      return { clubId };
    },

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['clubDetail', data.clubId] });
    },

    onError: () => {
      alert('커버 이미지 업로드에 실패했어요. 다시 시도해주세요!');
    },
  });
};

export const useDeleteCover = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (clubId: string) => {
      await coverApi.delete(clubId);
      return { clubId };
    },

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['clubDetail', data.clubId] });
    },

    onError: () => {
      alert('커버 이미지 삭제에 실패했어요. 다시 시도해주세요!');
    },
  });
};

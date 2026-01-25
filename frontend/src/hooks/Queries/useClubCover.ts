import { useMutation, useQueryClient } from '@tanstack/react-query';
import { coverApi, uploadToStorage } from '@/apis/image';
import { queryKeys } from '@/constants/queryKeys';

interface CoverUploadParams {
  clubId: string;
  file: File;
}

export const useUploadCover = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ clubId, file }: CoverUploadParams) => {
      const uploadUrlData = await coverApi.getUploadUrl(
        clubId,
        file.name,
        file.type,
      );

      if (!uploadUrlData) {
        throw new Error('커버 업로드 URL 생성 실패');
      }

      const { presignedUrl, finalUrl } = uploadUrlData;

      await uploadToStorage(presignedUrl, file);

      await coverApi.completeUpload(clubId, finalUrl);

      return { clubId };
    },

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.club.detail(data.clubId),
      });
    },

    onError: () => {
      console.error('Error uploading cover');
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
      queryClient.invalidateQueries({
        queryKey: queryKeys.club.detail(data.clubId),
      });
    },

    onError: () => {
      console.error('Error deleting cover');
    },
  });
};

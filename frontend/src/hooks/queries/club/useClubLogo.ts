import { useMutation, useQueryClient } from '@tanstack/react-query';
import { uploadClubLogo } from '@/apis/updateClubLogo';
import { deleteClubLogo } from '@/apis/deleteClubLogo';

export const useUploadClubLogo = (clubId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => uploadClubLogo(clubId, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clubDetail', clubId] });
    },
  });
};

export const useDeleteClubLogo = (clubId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteClubLogo(clubId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clubDetail', clubId] });
    },
  });
};

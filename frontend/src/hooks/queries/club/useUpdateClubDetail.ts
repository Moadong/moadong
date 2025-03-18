import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateClubDetail } from '@/apis/updateClubDetail';
import { ClubDetail } from '@/types/club';

export const useUpdateClubDetail = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updatedData: Partial<ClubDetail>) =>
      updateClubDetail(updatedData),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['clubDetail'],
      });
    },

    onError: (error) => {
      console.error('Error updating club detail:', error);
    },
  });
};

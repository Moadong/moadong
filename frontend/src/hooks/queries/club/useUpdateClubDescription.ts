import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateClubDescription } from '@/apis/updateClubDescription';
import { ClubDescription } from '@/types/club';

export const useUpdateClubDescription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updatedData: ClubDescription) =>
      updateClubDescription(updatedData),

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

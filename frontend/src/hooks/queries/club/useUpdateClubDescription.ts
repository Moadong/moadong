import { useMutation } from '@tanstack/react-query';
import { updateClubDescription } from '@/apis/updateClubDescription';
import { ClubDescription } from '@/types/club';

export const useUpdateClubDescription = () => {
  return useMutation({
    mutationFn: (updatedData: ClubDescription) =>
      updateClubDescription(updatedData),

    onError: (error) => {
      console.error('Error updating club detail:', error);
    },
  });
};

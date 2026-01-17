import { useMutation } from '@tanstack/react-query';
import { updateClubDetail } from '@/apis/club';
import { ClubDetail } from '@/types/club';

export const useUpdateClubDetail = () => {
  return useMutation({
    mutationFn: (updatedData: Partial<ClubDetail>) =>
      updateClubDetail(updatedData),

    onError: (error) => {
      console.error('Error updating club detail:', error);
    },
  });
};

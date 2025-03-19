import { getClubDetail } from '@/apis/getClubDetail';
import { useQuery } from '@tanstack/react-query';
import { ClubDetail } from '@/types/club';

export const useGetClubDetail = (clubId: string) => {
  return useQuery<ClubDetail>({
    queryKey: ['clubDetail', clubId],
    queryFn: () => getClubDetail(clubId as string),
    enabled: !!clubId,
  });
};

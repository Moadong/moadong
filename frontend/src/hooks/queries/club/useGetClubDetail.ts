import { getClubDetail } from '@/apis/getClubDetail';
import { useQuery } from '@tanstack/react-query';

export const useGetClubDetail = (clubId: string) => {
  return useQuery({
    queryKey: ['clubDetail', clubId],
    queryFn: () => getClubDetail(clubId as string),
    enabled: !!clubId,
  });
};

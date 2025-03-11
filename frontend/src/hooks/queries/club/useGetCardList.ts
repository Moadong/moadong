import { useQuery } from '@tanstack/react-query';
import { getClubList } from '@/apis/getClubList';

export const useGetCardList = (
  keyword: string,
  recruitmentStatus: string,
  category: string,
  division: string,
) => {
  return useQuery({
    queryKey: ['clubs', keyword, recruitmentStatus, division, category],
    queryFn: () =>
      getClubList(keyword, recruitmentStatus,  division,  category),
  });
};

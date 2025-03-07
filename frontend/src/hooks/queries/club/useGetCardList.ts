import { useQuery } from '@tanstack/react-query';
import { getClubList } from '@/apis/getClubList';

export const useGetCardList = (
  keyword: string,
  recruitmentStatus: string,
  classification: string,
  division: string,
) => {
  return useQuery({
    queryKey: ['clubs', keyword, recruitmentStatus, classification, division],
    queryFn: () =>
      getClubList(keyword, recruitmentStatus, classification, division),
  });
};

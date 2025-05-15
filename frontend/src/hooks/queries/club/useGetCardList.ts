import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getClubList } from '@/apis/getClubList';
import { Club } from '@/types/club';
import convertToDriveUrl from '@/utils/convertGoogleDriveUrl';

export const useGetCardList = (
  keyword: string,
  recruitmentStatus: string,
  category: string,
  division: string,
) => {
  return useQuery<Club[], unknown, Club[]>({
    queryKey: ['clubs', keyword, recruitmentStatus, division, category],
    queryFn: () => getClubList(keyword, recruitmentStatus, division, category),
    placeholderData: keepPreviousData,
    select: (data) =>
      data.map((club) => ({
        ...club,
        logo: convertToDriveUrl(club.logo),
      })),
  });
};

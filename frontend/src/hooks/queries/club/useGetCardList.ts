import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getClubList } from '@/apis/getClubList';
import { ClubSearchResponse } from '@/types/club.responses';
import convertToDriveUrl from '@/utils/convertGoogleDriveUrl';

export const useGetCardList = (
  keyword: string,
  recruitmentStatus: string,
  category: string,
  division: string,
) => {
  return useQuery<ClubSearchResponse, unknown, ClubSearchResponse>({
    queryKey: ['clubs', keyword, recruitmentStatus, division, category],
    queryFn: () => getClubList(keyword, recruitmentStatus, division, category),
    placeholderData: keepPreviousData,
    select: (data) => ({
      totalCount: data.totalCount,
      clubs: (data.clubs.map((club) => ({
        ...club,
        logo: convertToDriveUrl(club.logo),
      }))),
    }),
  });
};

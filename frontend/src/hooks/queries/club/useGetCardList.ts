import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getClubList } from '@/apis/getClubList';
import { ClubSearchResponse } from '@/types/club.responses';
import convertToDriveUrl from '@/utils/convertGoogleDriveUrl';

interface UseGetCardListProps {
  keyword: string;
  recruitmentStatus: string;
  category: string;
  division: string;
}

export const useGetCardList = (
  { keyword, recruitmentStatus, category, division }: UseGetCardListProps,
) => {
  return useQuery<ClubSearchResponse, unknown, ClubSearchResponse>({
    queryKey: ['clubs', keyword, recruitmentStatus, category, division],
    queryFn: () => getClubList(keyword, recruitmentStatus, category, division),
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

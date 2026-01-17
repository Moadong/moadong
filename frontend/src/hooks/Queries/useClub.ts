import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query';
import {
  getClubDetail,
  getClubList,
  updateClubDescription,
  updateClubDetail,
} from '@/apis/club';
import { queryKeys } from '@/constants/queryKeys';
import { ClubDetail, ClubDescription } from '@/types/club';
import { ClubSearchResponse } from '@/types/club.responses';
import convertToDriveUrl from '@/utils/convertGoogleDriveUrl';
import convertGoogleDriveUrl from '@/utils/convertGoogleDriveUrl';

interface UseGetCardListProps {
  keyword: string;
  recruitmentStatus: string;
  category: string;
  division: string;
}

export const useGetClubDetail = (clubId: string) => {
  return useQuery<ClubDetail>({
    queryKey: queryKeys.club.detail(clubId),
    queryFn: () => getClubDetail(clubId as string),
    enabled: !!clubId,
    select: (data) =>
      ({
        ...data,
        logo: data.logo ? convertGoogleDriveUrl(data.logo) : undefined,
        feeds: Array.isArray(data.feeds)
          ? data.feeds.map(convertGoogleDriveUrl)
          : [],
      }) as ClubDetail,
  });
};

export const useGetCardList = ({
  keyword,
  recruitmentStatus,
  category,
  division,
}: UseGetCardListProps) => {
  return useQuery<ClubSearchResponse, unknown, ClubSearchResponse>({
    queryKey: queryKeys.club.list(
      keyword,
      recruitmentStatus,
      category,
      division,
    ),
    queryFn: () => getClubList(keyword, recruitmentStatus, category, division),
    placeholderData: keepPreviousData,
    select: (data) => ({
      totalCount: data.totalCount,
      clubs: data.clubs.map((club) => ({
        ...club,
        logo: convertToDriveUrl(club.logo),
      })),
    }),
  });
};

export const useUpdateClubDescription = () => {
  return useMutation({
    mutationFn: (updatedData: ClubDescription) =>
      updateClubDescription(updatedData),

    onError: (error) => {
      console.error('Error updating club detail:', error);
    },
  });
};

export const useUpdateClubDetail = () => {
  return useMutation({
    mutationFn: (updatedData: Partial<ClubDetail>) =>
      updateClubDetail(updatedData),

    onError: (error) => {
      console.error('Error updating club detail:', error);
    },
  });
};

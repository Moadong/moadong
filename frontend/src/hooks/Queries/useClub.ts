import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {
  getClubDetail,
  getClubList,
  updateClubDescription,
  updateClubDetail,
} from '@/apis/club';
import { queryKeys } from '@/constants/queryKeys';
import { ClubDescription, ClubDetail, ClubSearchResponse } from '@/types/club';
import convertGoogleDriveUrl from '@/utils/convertGoogleDriveUrl';

interface UseGetCardListProps {
  keyword: string;
  recruitmentStatus: string;
  category: string;
  division: string;
}

export const useGetClubDetail = (clubParam: string) => {
  return useQuery<ClubDetail>({
    queryKey: queryKeys.club.detail(clubParam),
    queryFn: () => getClubDetail(clubParam as string),
    staleTime: 60 * 1000,
    enabled: !!clubParam,
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
    staleTime: 60 * 1000,
    placeholderData: keepPreviousData,
    select: (data) => ({
      totalCount: data.totalCount,
      clubs: data.clubs.map((club) => ({
        ...club,
        logo: convertGoogleDriveUrl(club.logo),
      })),
    }),
  });
};

export const useUpdateClubDescription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updatedData: ClubDescription) =>
      updateClubDescription(updatedData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.club.detail(variables.id),
      });
    },
    onError: (error) => {
      console.error('Error updating club description:', error);
    },
  });
};

export const useUpdateClubDetail = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updatedData: Partial<ClubDetail>) =>
      updateClubDetail(updatedData),
    onSuccess: (_, variables) => {
      if (variables.id) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.club.detail(variables.id),
        });
      }
    },

    onError: (error) => {
      console.error('Error updating club detail:', error);
    },
  });
};

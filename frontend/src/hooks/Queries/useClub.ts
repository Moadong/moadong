import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {
  getClubCalendarEvents,
  getClubDetail,
  getClubList,
  updateClubDescription,
  updateClubDetail,
} from '@/apis/club';
import { queryKeys } from '@/constants/queryKeys';
import {
  ClubCalendarEvent,
  ClubDescription,
  ClubDetail,
  ClubSearchResponse,
} from '@/types/club';
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

export const useGetClubCalendarEvents = (
  clubParam: string,
  options?: { enabled?: boolean },
) => {
  return useQuery<ClubCalendarEvent[]>({
    queryKey: queryKeys.club.calendarEvents(clubParam),
    queryFn: () => getClubCalendarEvents(clubParam),
    staleTime: 5 * 60 * 1000,
    enabled: (options?.enabled ?? true) && !!clubParam,
    select: (data) =>
      data.filter(
        (event): event is ClubCalendarEvent =>
          !!event &&
          typeof event.id === 'string' &&
          typeof event.title === 'string' &&
          typeof event.start === 'string',
      ),
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

export const useValidateClubName = () => {
  const queryClient = useQueryClient();
  return async (name: string) => {
    const { clubs } = await queryClient.ensureQueryData({
      queryKey: queryKeys.club.suggestions(name),
      queryFn: () => getClubList(name),
      staleTime: 30 * 1000,
    });
    return clubs.some((c) => c.name === name);
  };
};

export const useClubSuggestions = (keyword: string) => {
  return useQuery({
    queryKey: queryKeys.club.suggestions(keyword),
    queryFn: () => getClubList(keyword),
    enabled: !!keyword.trim(),
    staleTime: 30 * 1000,
    select: (data) => data.clubs.map((c) => c.name),
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

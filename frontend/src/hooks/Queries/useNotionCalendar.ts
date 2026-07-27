import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  fetchNotionDatabasePages,
  fetchNotionDatabases,
  fetchNotionPages,
  type NotionPagesResponse,
} from '@/apis/calendarOAuth';
import { queryKeys } from '@/constants/queryKeys';

/** 연동 전에는 401·403이 정상 흐름이므로 에러 대신 빈 상태로 처리한다. */
const isNotConnectedError = (error: unknown) => {
  const status =
    typeof error === 'object' &&
    error !== null &&
    'status' in error &&
    typeof (error as { status?: unknown }).status === 'number'
      ? (error as { status: number }).status
      : undefined;
  return status === 401 || status === 403;
};

export const useGetNotionDatabases = () => {
  return useQuery({
    queryKey: queryKeys.notionCalendar.databases(),
    queryFn: async () => {
      try {
        return await fetchNotionDatabases();
      } catch (error) {
        if (isNotConnectedError(error)) return [];
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useGetNotionPages = () => {
  return useQuery<NotionPagesResponse | null>({
    queryKey: queryKeys.notionCalendar.pages(),
    queryFn: async () => {
      try {
        return await fetchNotionPages();
      } catch (error) {
        if (isNotConnectedError(error)) return null;
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000,
  });
};

/** 선택한 데이터베이스의 페이지를 불러와 페이지 캐시에 반영한다. */
export const useApplyNotionDatabase = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (databaseId: string) => fetchNotionDatabasePages({ databaseId }),
    onSuccess: (response) => {
      queryClient.setQueryData(queryKeys.notionCalendar.pages(), response);
    },
  });
};

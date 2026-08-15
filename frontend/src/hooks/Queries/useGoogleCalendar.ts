import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  disconnectGoogleCalendar,
  fetchGoogleCalendarEvents,
  fetchGoogleCalendars,
  selectGoogleCalendar,
} from '@/apis/calendarOAuth';
import { queryKeys } from '@/constants/queryKeys';
import { ApiError } from '@/errors';
import type { GoogleCalendarListResponse } from '@/types/google';

// 연동 이력이 아예 없는 경우. 에러가 아니라 "연결 안 됨" 상태로 처리한다.
const NOT_CONNECTED_ERROR_CODE = '960-4';

// 저장된 refresh token이 만료·무효라 갱신에 실패한 경우.
// 연동은 해뒀지만 끊긴 상태라 "연결 안 됨"과 구분해 재연동을 안내한다.
export const TOKEN_REFRESH_FAILED_ERROR_CODE = '960-3';

export const isTokenRefreshFailedError = (error: unknown) =>
  error instanceof ApiError &&
  error.errorCode === TOKEN_REFRESH_FAILED_ERROR_CODE;

export const useGetGoogleCalendars = () => {
  return useQuery<GoogleCalendarListResponse | null>({
    queryKey: queryKeys.googleCalendar.calendars(),
    queryFn: async () => {
      try {
        return await fetchGoogleCalendars();
      } catch (error) {
        if (
          error instanceof ApiError &&
          error.errorCode === NOT_CONNECTED_ERROR_CODE
        ) {
          return null;
        }
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useGetGoogleCalendarEvents = (
  calendarId: string,
  timeMin: string,
  timeMax: string,
) => {
  return useQuery({
    queryKey: queryKeys.googleCalendar.events(calendarId, timeMin, timeMax),
    queryFn: () => fetchGoogleCalendarEvents(calendarId, timeMin, timeMax),
    staleTime: 5 * 60 * 1000,
    enabled: !!calendarId,
  });
};

export const useSelectGoogleCalendar = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      calendarId,
      calendarName,
    }: {
      calendarId: string;
      calendarName: string;
    }) => selectGoogleCalendar(calendarId, calendarName),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.googleCalendar.calendars(),
      });
    },
  });
};

export const useDisconnectGoogleCalendar = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: disconnectGoogleCalendar,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.googleCalendar.all,
      });
    },
  });
};

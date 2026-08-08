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

// 연동이 없거나(960-4) 저장된 토큰이 만료·무효라 갱신 실패한 경우(960-3)는
// 에러가 아니라 "연결 안 됨(재연동 필요)" 상태로 처리한다.
const NOT_CONNECTED_ERROR_CODES = ['960-3', '960-4'];

export const useGetGoogleCalendars = () => {
  return useQuery<GoogleCalendarListResponse | null>({
    queryKey: queryKeys.googleCalendar.calendars(),
    queryFn: async () => {
      try {
        return await fetchGoogleCalendars();
      } catch (error) {
        if (
          error instanceof ApiError &&
          error.errorCode &&
          NOT_CONNECTED_ERROR_CODES.includes(error.errorCode)
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

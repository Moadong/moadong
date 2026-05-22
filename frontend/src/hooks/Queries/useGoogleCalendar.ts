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

export const useGetGoogleCalendars = () => {
  return useQuery<GoogleCalendarListResponse | null>({
    queryKey: queryKeys.googleCalendar.calendars(),
    queryFn: async () => {
      try {
        return await fetchGoogleCalendars();
      } catch (error) {
        if (error instanceof ApiError && error.errorCode === '960-4') {
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

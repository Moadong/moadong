import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  fetchHiddenCalendarEvents,
  hideCalendarEvent,
} from '@/apis/hiddenCalendarEvents';
import { queryKeys } from '@/constants/queryKeys';
import type { HiddenCalendarEvent } from '@/types/club';

export const useGetHiddenCalendarEvents = () => {
  return useQuery({
    queryKey: queryKeys.hiddenCalendarEvents.list(),
    queryFn: fetchHiddenCalendarEvents,
    staleTime: 5 * 60 * 1000,
  });
};

export const useHideCalendarEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: HiddenCalendarEvent) => hideCalendarEvent(input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.hiddenCalendarEvents.all,
      });
    },
  });
};

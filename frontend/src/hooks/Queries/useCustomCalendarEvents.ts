import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createCustomCalendarEvent,
  deleteCustomCalendarEvent,
  fetchCustomCalendarEvents,
  updateCustomCalendarEvent,
} from '@/apis/customCalendarEvents';
import { queryKeys } from '@/constants/queryKeys';
import type { CustomCalendarEventInput } from '@/types/club';

export const useGetCustomCalendarEvents = () => {
  return useQuery({
    queryKey: queryKeys.customCalendarEvents.list(),
    queryFn: fetchCustomCalendarEvents,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateCustomCalendarEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CustomCalendarEventInput) =>
      createCustomCalendarEvent(input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.customCalendarEvents.all,
      });
    },
  });
};

export const useUpdateCustomCalendarEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      eventId,
      input,
    }: {
      eventId: string;
      input: CustomCalendarEventInput;
    }) => updateCustomCalendarEvent(eventId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.customCalendarEvents.all,
      });
    },
  });
};

export const useDeleteCustomCalendarEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (eventId: string) => deleteCustomCalendarEvent(eventId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.customCalendarEvents.all,
      });
    },
  });
};

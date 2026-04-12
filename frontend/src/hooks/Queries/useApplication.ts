import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  deleteApplication,
  duplicateApplication,
  getAllApplicationForms,
  getApplication,
  updateApplicationStatus,
} from '@/apis/application';
import { queryKeys } from '@/constants/queryKeys';

export const useGetApplication = (
  clubId: string | undefined,
  applicationFormId: string | undefined,
) => {
  return useQuery({
    queryKey: queryKeys.application.detail(
      clubId || 'unknown',
      applicationFormId || 'unknown',
    ),
    queryFn: () => getApplication(clubId!, applicationFormId!),
    enabled: !!clubId && !!applicationFormId,
  });
};

export const useGetApplicationList = () => {
  return useQuery({
    queryKey: queryKeys.application.all,
    queryFn: () => getAllApplicationForms(),
  });
};

export const useDeleteApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (applicationFormId: string) =>
      deleteApplication(applicationFormId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.application.all,
      });
    },
    onError: (_error) => {
    },
  });
};

export const useDuplicateApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (applicationFormId: string) =>
      duplicateApplication(applicationFormId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.application.all,
      });
    },
    onError: (_error) => {
      // console.error(`Error duplicating application: ${_error}`);
    },
  });
};

export const useUpdateApplicationStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      applicationFormId,
      currentStatus,
    }: {
      applicationFormId: string;
      currentStatus: string;
    }) => updateApplicationStatus(applicationFormId, currentStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.application.all,
      });
    },
    onError: (_error) => {
    },
  });
};

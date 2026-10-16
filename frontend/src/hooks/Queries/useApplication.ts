import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  deleteApplication,
  duplicateApplication,
  getAiDraftQuota,
  getAllApplicationForms,
  getApplication,
  updateApplicationStatus,
} from '@/apis/application';
import { queryKeys } from '@/constants/queryKeys';
import { ApplicationFormStatus } from '@/types/application';

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

export const useAiDraftQuota = (
  clubId: string | undefined,
  enabled: boolean = true,
) => {
  return useQuery({
    queryKey: queryKeys.application.aiDraftQuota(clubId || 'unknown'),
    queryFn: () => getAiDraftQuota(),
    enabled: !!clubId && enabled,
    staleTime: 60 * 1000,
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
    onError: (error) => {
      console.error(`Error delete application detail: ${error}`);
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
    onError: (error) => {
      console.error(`Error duplicating application: ${error}`);
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
      currentStatus: ApplicationFormStatus;
    }) => updateApplicationStatus(applicationFormId, currentStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.application.all,
      });
    },
    onError: (error) => {
      console.error('Error updating application status:', error);
    },
  });
};

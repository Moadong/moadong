import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  deleteApplication,
  duplicateApplication,
  getApplication,
  getAllApplicationForms,
} from '@/apis/application';
import { queryKeys } from '@/constants/queryKeys';

export const useGetApplication = (
  clubId: string | undefined,
  applicationFormId: string | undefined,
) => {
  return useQuery({
    queryKey:
      clubId && applicationFormId
        ? queryKeys.application.detail(clubId, applicationFormId)
        : queryKeys.application.all,
    queryFn: () => getApplication(clubId!, applicationFormId!),
    retry: false,
    enabled: !!clubId && !!applicationFormId,
  });
};

export const useGetApplicationlist = () => {
  return useQuery({
    queryKey: queryKeys.application.all,
    queryFn: () => getAllApplicationForms(),
    retry: false,
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

import { useMutation, useQueryClient } from '@tanstack/react-query';
import deleteApplication from '@/apis/application/deleteApplication';

export const useDeleteApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (applicationFormId: string) =>
      deleteApplication(applicationFormId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['applicationForm'],
      });
    },
    onError: (error) => {
      console.error(`Error delete application detail: ${error}`);
    },
  });
};

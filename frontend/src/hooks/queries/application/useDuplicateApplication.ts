import { useMutation, useQueryClient } from '@tanstack/react-query';
import { duplicateApplication } from '@/apis/application/duplicateApplication';

export const useDuplicateApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (applicationFormId: string) =>
      duplicateApplication(applicationFormId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['applicationForm'],
      });
    },
    onError: (error) => {
      console.error(`Error duplicating application: ${error}`);
    },
  });
};

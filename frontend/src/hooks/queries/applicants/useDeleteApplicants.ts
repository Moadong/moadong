import deleteApplicants from '@/apis/applicants/deleteApplicants';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useDeleteApplicants = (applicationFormId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ applicantIds }: { applicantIds: string[] }) =>
      deleteApplicants(applicantIds, applicationFormId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['clubApplicants', applicationFormId],
      });
    },
    onError: (error) => {
      console.error(`Error delete applicants detail: ${error}`);
    },
  });
};

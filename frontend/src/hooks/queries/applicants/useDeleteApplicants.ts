import deleteApplicants from '@/apis/applicants/deleteApplicants';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useDeleteApplicants = (clubId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ applicantIds }: { applicantIds: string[] }) =>
      deleteApplicants(applicantIds, clubId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clubApplicants'] });
    },
    onError: (error) => {
      console.error(`Error delete applicants detail: ${error}`);
    },
  });
};

import deleteApplicants from '@/apis/applicants/deleteApplicants';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useDeleteApplicants = (clubId: string, applicationFormId: string,) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ applicantIds }: { applicantIds: string[] }) =>
      deleteApplicants(applicantIds, clubId, applicationFormId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clubApplicants', clubId, applicationFormId]});
    },
    onError: (error) => {
      console.error(`Error delete applicants detail: ${error}`);
    },
  });
};

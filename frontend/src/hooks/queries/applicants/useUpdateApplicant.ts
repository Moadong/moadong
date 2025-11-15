import { updateApplicantDetail } from '@/apis/application/updateApplicantDetail';
import { UpdateApplicantParams } from '@/types/applicants';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useUpdateApplicant = (applicationFormId: string | undefined) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (applicant: UpdateApplicantParams[]) =>
      updateApplicantDetail(applicant, applicationFormId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['clubApplicants', applicationFormId],
      });
    },
    onError: (error) => {
      console.log(`Error updating applicant detail: ${error}`);
    },
  });
};

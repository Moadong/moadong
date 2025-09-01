import { updateApplicantDetail } from '@/apis/application/updateApplicantDetail';
import { UpdateApplicantParams } from '@/types/applicants';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useUpdateApplicant = (clubId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (applicant: UpdateApplicantParams[]) =>
      updateApplicantDetail(applicant, clubId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clubApplicants'] });
    },
    onError: (error) => {
      console.log(`Error updating applicant detail: ${error}`);
    },
  });
};

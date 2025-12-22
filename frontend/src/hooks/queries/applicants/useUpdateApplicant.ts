import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateApplicantDetail } from '@/apis/application/updateApplicantDetail';
import { UpdateApplicantParams } from '@/types/applicants';

export const useUpdateApplicant = (applicationFormId: string | undefined) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (applicant: UpdateApplicantParams[]) => {
      if (!applicationFormId) {
        throw new Error('Application Form ID가 유효하지 않습니다.');
      }
      return updateApplicantDetail(applicant, applicationFormId);
    },
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

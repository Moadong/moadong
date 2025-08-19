import { updateApplicantDetail } from "@/apis/application/updateApplicantDetail";
import { ApplicationStatus } from "@/types/applicants";
import { useMutation, useQueryClient } from "@tanstack/react-query"

export const useUpdateApplicant = (clubId: string, applicantId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({memo, status}: { memo: string, status: ApplicationStatus }) => 
      updateApplicantDetail(memo, status, clubId, applicantId),
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["clubApplicants"] });
    },
    onError: (error) => {
      console.log(`Error updating applicant detail: ${error}`);
    }
  })
}
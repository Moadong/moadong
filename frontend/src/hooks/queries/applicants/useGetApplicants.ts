import getClubApplicants from "@/apis/applicants/getClubApplicants"
import { useQuery } from "@tanstack/react-query"

export const useGetApplicants = (clubId: string, applicationFormId: string,) => {
  return useQuery({
    queryKey: ['clubApplicants', clubId, applicationFormId],
    queryFn: () => getClubApplicants(clubId, applicationFormId),
    retry: false,
  })
}
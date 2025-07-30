import getClubApplicants from "@/apis/applicants/getClubApplicants"
import { useQuery } from "@tanstack/react-query"

export const useGetApplicants = (clubId: string) => {
  return useQuery({
    queryKey: ['clubApplicants', clubId],
    queryFn: () => getClubApplicants(clubId),
    retry: false,
  })
}
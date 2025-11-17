import getClubApplicants from '@/apis/applicants/getClubApplicants';
import { useQuery } from '@tanstack/react-query';

export const useGetApplicants = (applicationFormId: string | undefined) => {
  return useQuery({
    queryKey: ['clubApplicants', applicationFormId],
    queryFn: () => getClubApplicants(applicationFormId!),
    retry: false,
    enabled: !!applicationFormId,
  });
};

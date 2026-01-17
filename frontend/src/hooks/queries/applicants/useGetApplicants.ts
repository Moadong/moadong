import { useQuery } from '@tanstack/react-query';
import { getClubApplicants } from '@/apis/applicants';

export const useGetApplicants = (applicationFormId: string | undefined) => {
  return useQuery({
    queryKey: ['clubApplicants', applicationFormId],
    queryFn: () => getClubApplicants(applicationFormId!),
    retry: false,
    enabled: !!applicationFormId,
  });
};

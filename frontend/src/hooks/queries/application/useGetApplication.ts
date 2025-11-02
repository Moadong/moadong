import { useQuery } from '@tanstack/react-query';
import getApplication from '@/apis/application/getApplication';

export const useGetApplication = (clubId: string | undefined, applicationFormId: string | undefined) => {
  return useQuery({
    queryKey: ['applicationForm', clubId, applicationFormId],
    queryFn: () => getApplication(clubId!, applicationFormId!),
    retry: false,
    enabled: !!clubId && !!applicationFormId,
  });
};

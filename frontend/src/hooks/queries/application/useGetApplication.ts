import { useQuery } from '@tanstack/react-query';
import getApplication from '@/apis/application/getApplication';

export const useGetApplication = (clubId: string) => {
  return useQuery({
    queryKey: ['applicationForm', clubId],
    queryFn: () => getApplication(clubId),
    retry: false,
    enabled: !!clubId,
  });
};

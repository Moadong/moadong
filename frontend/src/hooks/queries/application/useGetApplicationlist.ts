import getAllApplications from '@/apis/application/getAllApplications';
import { useQuery } from '@tanstack/react-query';

export const useGetApplicationlist = () => {
  return useQuery({
    queryKey: ['applicationForm'],
    queryFn: () => getAllApplications(),
    retry: false,
  });
};
export default useGetApplicationlist;
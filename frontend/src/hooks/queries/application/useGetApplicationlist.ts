import { useQuery } from '@tanstack/react-query';
import getAllApplications from '@/apis/application/getAllApplications';

export const useGetApplicationlist = () => {
  return useQuery({
    queryKey: ['applicationForm'],
    queryFn: () => getAllApplications(),
    retry: false,
  });
};
export default useGetApplicationlist;

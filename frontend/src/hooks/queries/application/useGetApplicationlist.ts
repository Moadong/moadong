import { useQuery } from '@tanstack/react-query';
import { getAllApplicationForms } from '@/apis/application';

export const useGetApplicationlist = () => {
  return useQuery({
    queryKey: ['applicationForm'],
    queryFn: () => getAllApplicationForms(),
    retry: false,
  });
};
export default useGetApplicationlist;

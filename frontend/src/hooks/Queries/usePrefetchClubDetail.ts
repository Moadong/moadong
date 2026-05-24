import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getClubDetail } from '@/apis/club';
import { queryKeys } from '@/constants/queryKeys';
import isInAppWebView from '@/utils/isInAppWebView';

// useGetClubDetail과 동일하게 유지해야 prefetch 결과가 그대로 재사용됨
const STALE_TIME = 60 * 1000;

const usePrefetchClubDetail = () => {
  const queryClient = useQueryClient();

  const prefetch = useCallback(
    (clubParam: string): boolean => {
      if (!clubParam) return false;
      if (isInAppWebView()) return false;

      queryClient.prefetchQuery({
        queryKey: queryKeys.club.detail(clubParam),
        queryFn: () => getClubDetail(clubParam),
        staleTime: STALE_TIME,
      });
      return true;
    },
    [queryClient],
  );

  const hasCachedData = useCallback(
    (clubParam: string): boolean => {
      const state = queryClient.getQueryState(queryKeys.club.detail(clubParam));
      return state?.status === 'success' && !!state.data;
    },
    [queryClient],
  );

  return { prefetch, hasCachedData };
};

export default usePrefetchClubDetail;

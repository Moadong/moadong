import { useQuery } from '@tanstack/react-query';
import {
  getClubStatisticsOverview,
  getClubStatisticsTrend,
  getSearchKeywordStatistics,
} from '@/apis/statistics';
import { queryKeys } from '@/constants/queryKeys';
import type {
  ClubStatisticsOverview,
  ClubStatisticsTrend,
  SearchKeywordStatistics,
} from '@/types/statistics';

const STATISTICS_STALE_TIME = 60 * 1000;

export const useClubStatisticsOverview = (
  from: string,
  to: string,
  enabled: boolean,
) => {
  return useQuery<ClubStatisticsOverview | undefined>({
    queryKey: queryKeys.statistics.overview(from, to),
    queryFn: () => getClubStatisticsOverview(from, to),
    staleTime: STATISTICS_STALE_TIME,
    enabled,
  });
};

export const useClubStatisticsTrend = (
  from: string,
  to: string,
  enabled: boolean,
) => {
  return useQuery<ClubStatisticsTrend | undefined>({
    queryKey: queryKeys.statistics.trend(from, to),
    queryFn: () => getClubStatisticsTrend(from, to),
    staleTime: STATISTICS_STALE_TIME,
    enabled,
  });
};

export const useSearchKeywordStatistics = (
  from: string,
  to: string,
  limit: number,
  enabled: boolean,
) => {
  return useQuery<SearchKeywordStatistics | undefined>({
    queryKey: queryKeys.statistics.searchKeywords(from, to, limit),
    queryFn: () => getSearchKeywordStatistics(from, to, limit),
    staleTime: STATISTICS_STALE_TIME,
    enabled,
  });
};

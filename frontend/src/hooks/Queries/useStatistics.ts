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

interface StatisticsQueryOptions {
  enabled?: boolean;
}

export const useClubStatisticsOverview = (
  startDate: string,
  endDate: string,
  options?: StatisticsQueryOptions,
) => {
  return useQuery<ClubStatisticsOverview | undefined>({
    queryKey: queryKeys.statistics.overview(startDate, endDate),
    queryFn: () => getClubStatisticsOverview(startDate, endDate),
    staleTime: STATISTICS_STALE_TIME,
    enabled: options?.enabled,
  });
};

export const useClubStatisticsTrend = (
  startDate: string,
  endDate: string,
  options?: StatisticsQueryOptions,
) => {
  return useQuery<ClubStatisticsTrend | undefined>({
    queryKey: queryKeys.statistics.trend(startDate, endDate),
    queryFn: () => getClubStatisticsTrend(startDate, endDate),
    staleTime: STATISTICS_STALE_TIME,
    enabled: options?.enabled,
  });
};

export const useSearchKeywordStatistics = (
  startDate: string,
  endDate: string,
  limit: number,
  options?: StatisticsQueryOptions,
) => {
  return useQuery<SearchKeywordStatistics | undefined>({
    queryKey: queryKeys.statistics.searchKeywords(startDate, endDate, limit),
    queryFn: () => getSearchKeywordStatistics(startDate, endDate, limit),
    staleTime: STATISTICS_STALE_TIME,
    enabled: options?.enabled,
  });
};

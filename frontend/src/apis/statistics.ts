import API_BASE_URL from '@/constants/api';
import type {
  ClubStatisticsOverview,
  ClubStatisticsTrend,
  SearchKeywordStatistics,
} from '@/types/statistics';
import { secureFetch } from './auth/secureFetch';
import { handleResponse } from './utils/apiHelpers';

const buildStatisticsUrl = (path: string, params: Record<string, string>) => {
  const url = new URL(`${API_BASE_URL}${path}`);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });
  return url.toString();
};

export const getClubStatisticsOverview = async (
  from: string,
  to: string,
) => {
  const response = await secureFetch(
    buildStatisticsUrl('/api/club/statistics/overview', { from, to }),
  );
  return handleResponse<ClubStatisticsOverview>(
    response,
    '통계 요약을 불러오지 못했습니다.',
  );
};

export const getClubStatisticsTrend = async (from: string, to: string) => {
  const response = await secureFetch(
    buildStatisticsUrl('/api/club/statistics/trend', { from, to }),
  );
  return handleResponse<ClubStatisticsTrend>(
    response,
    '통계 추이를 불러오지 못했습니다.',
  );
};

export const getSearchKeywordStatistics = async (
  from: string,
  to: string,
  limit: number,
) => {
  const response = await secureFetch(
    buildStatisticsUrl('/api/club/statistics/search-keywords', {
      from,
      to,
      limit: String(limit),
    }),
  );
  return handleResponse<SearchKeywordStatistics>(
    response,
    '검색어 통계를 불러오지 못했습니다.',
  );
};

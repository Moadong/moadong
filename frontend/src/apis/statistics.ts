import API_BASE_URL from '@/constants/api';
import type {
  ClubStatisticsOverview,
  ClubStatisticsTrend,
  SearchKeywordStatistics,
} from '@/types/statistics';
import { secureFetch } from './auth/secureFetch';
import { handleResponse } from './utils/apiHelpers';

const buildStatisticsUrl = (path: string, params: Record<string, string>) => {
  if (!API_BASE_URL || !/^https?:\/\//.test(API_BASE_URL)) {
    throw new Error('API_BASE_URL must be configured as an absolute URL.');
  }

  const url = new URL(path, API_BASE_URL);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });
  return url.toString();
};

export const getClubStatisticsOverview = async (
  startDate: string,
  endDate: string,
) => {
  const response = await secureFetch(
    buildStatisticsUrl('/api/club/statistics/overview', {
      from: startDate,
      to: endDate,
    }),
  );
  return handleResponse<ClubStatisticsOverview>(
    response,
    '통계 요약을 불러오지 못했습니다.',
  );
};

export const getClubStatisticsTrend = async (
  startDate: string,
  endDate: string,
) => {
  const response = await secureFetch(
    buildStatisticsUrl('/api/club/statistics/trend', {
      from: startDate,
      to: endDate,
    }),
  );
  return handleResponse<ClubStatisticsTrend>(
    response,
    '통계 추이를 불러오지 못했습니다.',
  );
};

export const getSearchKeywordStatistics = async (
  startDate: string,
  endDate: string,
  limit: number,
) => {
  const response = await secureFetch(
    buildStatisticsUrl('/api/club/statistics/search-keywords', {
      from: startDate,
      to: endDate,
      limit: String(limit),
    }),
  );
  return handleResponse<SearchKeywordStatistics>(
    response,
    '검색어 통계를 불러오지 못했습니다.',
  );
};

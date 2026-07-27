export interface ClubStatisticsOverview {
  clubId: string;
  clubName: string;
  from: string;
  to: string;
  totalDetailViews: number;
  averageDetailDurationSeconds: number;
  totalApplicants: number;
}

export interface ClubStatisticsDailyPoint {
  date: string;
  detailViews: number;
  averageDetailDurationSeconds: number;
  applicants: number;
}

export interface ClubStatisticsTrend {
  clubId: string;
  from: string;
  to: string;
  points: ClubStatisticsDailyPoint[];
}

export interface SearchKeywordRankItem {
  keyword: string;
  count: number;
}

export interface SearchKeywordStatistics {
  from: string;
  to: string;
  keywords: SearchKeywordRankItem[];
}

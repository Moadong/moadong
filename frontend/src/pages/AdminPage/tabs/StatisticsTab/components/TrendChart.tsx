import type { RefetchOptions, QueryObserverResult } from '@tanstack/react-query';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { colors } from '@/styles/theme/colors';
import type {
  ClubStatisticsDailyPoint,
  ClubStatisticsTrend,
} from '@/types/statistics';
import {
  formatChartDate,
  formatDuration,
  formatNumber,
} from '../utils/statisticsFormat';
import * as Styled from '../StatisticsTab.styles';

interface TrendChartProps {
  data?: ClubStatisticsTrend;
  isLoading: boolean;
  isError: boolean;
  onRetry: (
    options?: RefetchOptions,
  ) => Promise<QueryObserverResult<ClubStatisticsTrend | undefined, Error>>;
}

interface StatisticsTooltipProps {
  active?: boolean;
  payload?: Array<{
    color?: string;
    dataKey?: string;
    name?: string;
    value?: number;
    payload?: ClubStatisticsDailyPoint;
  }>;
  label?: string;
}

const StatisticsTooltip = ({
  active,
  payload,
  label,
}: StatisticsTooltipProps) => {
  if (!active || !payload?.length) return null;

  const point = payload[0]?.payload;

  return (
    <Styled.TooltipBox>
      <Styled.TooltipTitle>{label}</Styled.TooltipTitle>
      {payload.map((item) => (
        <Styled.TooltipRow key={item.dataKey} style={{ color: item.color }}>
          {item.name}: {formatNumber(Number(item.value ?? 0))}
        </Styled.TooltipRow>
      ))}
      {point && (
        <Styled.TooltipRow>
          평균 체류 시간: {formatDuration(point.averageDetailDurationSeconds)}
        </Styled.TooltipRow>
      )}
    </Styled.TooltipBox>
  );
};

const TrendChart = ({ data, isLoading, isError, onRetry }: TrendChartProps) => {
  if (isLoading) {
    return (
      <Styled.FeedbackBox>
        일자별 추이를 불러오는 중입니다.
      </Styled.FeedbackBox>
    );
  }

  if (isError) {
    return (
      <Styled.FeedbackBox>
        일자별 추이를 불러오지 못했습니다.
        <Styled.RetryButton type='button' onClick={() => onRetry()}>
          다시 시도
        </Styled.RetryButton>
      </Styled.FeedbackBox>
    );
  }

  const points = data?.points ?? [];
  const hasData = points.some(
    (point) =>
      point.detailViews > 0 ||
      point.applicants > 0 ||
      point.averageDetailDurationSeconds > 0,
  );

  if (!points.length || !hasData) {
    return (
      <Styled.FeedbackBox>
        선택한 기간에 통계 데이터가 없습니다.
      </Styled.FeedbackBox>
    );
  }

  const showDot = points.length <= 1;

  return (
    <Styled.ChartWrapper>
      <ResponsiveContainer width='100%' height='100%'>
        <LineChart
          data={points}
          margin={{ top: 12, right: 16, left: 0, bottom: 8 }}
        >
          <CartesianGrid strokeDasharray='3 3' vertical={false} />
          <XAxis dataKey='date' tickFormatter={formatChartDate} />
          <YAxis allowDecimals={false} />
          <Tooltip content={<StatisticsTooltip />} />
          <Legend />
          <Line
            type='monotone'
            dataKey='detailViews'
            name='상세 조회수'
            stroke={colors.primary[800]}
            strokeWidth={2}
            dot={showDot}
            activeDot={{ r: 4 }}
          />
          <Line
            type='monotone'
            dataKey='applicants'
            name='지원자 수'
            stroke={colors.secondary[4].main}
            strokeWidth={2}
            dot={showDot}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Styled.ChartWrapper>
  );
};

export default TrendChart;

import type { ClubStatisticsOverview } from '@/types/statistics';
import * as Styled from '../StatisticsTab.styles';
import { formatDuration, formatNumber } from '../utils/statisticsFormat';
import type { StatisticsRetryHandler } from './types';

interface MetricSummaryProps {
  data?: ClubStatisticsOverview;
  isLoading: boolean;
  isError: boolean;
  onRetry: StatisticsRetryHandler<ClubStatisticsOverview>;
}

const MetricSummary = ({
  data,
  isLoading,
  isError,
  onRetry,
}: MetricSummaryProps) => {
  if (isLoading) {
    return (
      <Styled.FeedbackBox>통계 요약을 불러오는 중입니다.</Styled.FeedbackBox>
    );
  }

  if (isError) {
    return (
      <Styled.FeedbackBox>
        통계 요약을 불러오지 못했습니다.
        <Styled.RetryButton type='button' onClick={() => onRetry()}>
          다시 시도
        </Styled.RetryButton>
      </Styled.FeedbackBox>
    );
  }

  if (!data) {
    return (
      <Styled.FeedbackBox>
        선택한 기간에 통계 데이터가 없습니다.
      </Styled.FeedbackBox>
    );
  }

  return (
    <Styled.MetricGrid>
      <Styled.MetricCard>
        <Styled.MetricLabel>상세 조회수</Styled.MetricLabel>
        <div>
          <Styled.MetricValue>
            {formatNumber(data.totalDetailViews)}
          </Styled.MetricValue>
          <Styled.MetricUnit>회</Styled.MetricUnit>
        </div>
      </Styled.MetricCard>
      <Styled.MetricCard>
        <Styled.MetricLabel>평균 체류 시간</Styled.MetricLabel>
        <Styled.MetricValue>
          {formatDuration(data.averageDetailDurationSeconds)}
        </Styled.MetricValue>
      </Styled.MetricCard>
      <Styled.MetricCard>
        <Styled.MetricLabel>고유 방문자</Styled.MetricLabel>
        <div>
          <Styled.MetricValue>
            {formatNumber(data.uniqueDetailVisitors)}
          </Styled.MetricValue>
          <Styled.MetricUnit>명</Styled.MetricUnit>
        </div>
      </Styled.MetricCard>
      <Styled.MetricCard>
        <Styled.MetricLabel>인당 평균 체류 시간</Styled.MetricLabel>
        <Styled.MetricValue>
          {formatDuration(data.averageDetailDurationSecondsPerVisitor)}
        </Styled.MetricValue>
      </Styled.MetricCard>
      <Styled.MetricCard>
        <Styled.MetricLabel>지원자 수</Styled.MetricLabel>
        <div>
          <Styled.MetricValue>
            {formatNumber(data.totalApplicants)}
          </Styled.MetricValue>
          <Styled.MetricUnit>명</Styled.MetricUnit>
        </div>
      </Styled.MetricCard>
    </Styled.MetricGrid>
  );
};

export default MetricSummary;

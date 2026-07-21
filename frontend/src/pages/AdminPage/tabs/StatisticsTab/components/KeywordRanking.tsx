import type { SearchKeywordStatistics } from '@/types/statistics';
import * as Styled from '../StatisticsTab.styles';
import { formatNumber } from '../utils/statisticsFormat';
import type { StatisticsRetryHandler } from './types';

interface KeywordRankingProps {
  data?: SearchKeywordStatistics;
  isLoading: boolean;
  isError: boolean;
  onRetry: StatisticsRetryHandler<SearchKeywordStatistics>;
}

const KeywordRanking = ({
  data,
  isLoading,
  isError,
  onRetry,
}: KeywordRankingProps) => {
  if (isLoading) {
    return (
      <Styled.FeedbackBox>검색어 통계를 불러오는 중입니다.</Styled.FeedbackBox>
    );
  }

  if (isError) {
    return (
      <Styled.FeedbackBox>
        검색어 통계를 불러오지 못했습니다.
        <Styled.RetryButton type='button' onClick={() => onRetry()}>
          다시 시도
        </Styled.RetryButton>
      </Styled.FeedbackBox>
    );
  }

  const keywords = data?.keywords ?? [];
  if (!keywords.length) {
    return (
      <Styled.FeedbackBox>
        선택한 기간에 검색어 데이터가 없습니다.
      </Styled.FeedbackBox>
    );
  }

  const maxCount = Math.max(...keywords.map((item) => item.count), 1);

  return (
    <Styled.KeywordList>
      {keywords.map((item, index) => {
        const width = Math.max(6, Math.round((item.count / maxCount) * 100));

        return (
          <Styled.KeywordItem key={`${item.keyword}-${index}`}>
            <Styled.KeywordRank>{index + 1}</Styled.KeywordRank>
            <Styled.KeywordBody>
              <Styled.KeywordText title={item.keyword}>
                {item.keyword}
              </Styled.KeywordText>
              <Styled.KeywordBarTrack>
                <Styled.KeywordBar $width={width} />
              </Styled.KeywordBarTrack>
            </Styled.KeywordBody>
            <Styled.KeywordCount>
              {formatNumber(item.count)}회
            </Styled.KeywordCount>
          </Styled.KeywordItem>
        );
      })}
    </Styled.KeywordList>
  );
};

export default KeywordRanking;

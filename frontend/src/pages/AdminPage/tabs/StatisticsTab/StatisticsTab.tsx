import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import WebviewTopBar from '@/components/common/WebviewTopBar/WebviewTopBar';
import { PAGE_VIEW } from '@/constants/eventName';
import useTrackPageView from '@/hooks/Mixpanel/useTrackPageView';
import {
  useClubStatisticsOverview,
  useClubStatisticsTrend,
  useSearchKeywordStatistics,
} from '@/hooks/Queries/useStatistics';
import useDevice from '@/hooks/useDevice';
import { ContentSection } from '@/pages/AdminPage/components/ContentSection/ContentSection';
import KeywordRanking from './components/KeywordRanking';
import MetricSummary from './components/MetricSummary';
import PeriodSelector from './components/PeriodSelector';
import TrendChart from './components/TrendChart';
import * as Styled from './StatisticsTab.styles';
import {
  getRecentDateRange,
  StatisticsDateRange,
  validateStatisticsDateRange,
} from './utils/statisticsDate';

const SEARCH_KEYWORD_LIMIT = 10;
const DEFAULT_PRESET_DAYS = 7;

const StatisticsTab = () => {
  useTrackPageView(PAGE_VIEW.ADMIN_STATISTICS_PAGE);
  const navigate = useNavigate();
  const { isMobile, isTablet } = useDevice();

  const [range, setRange] = useState<StatisticsDateRange>(() =>
    getRecentDateRange(DEFAULT_PRESET_DAYS),
  );
  const [activePreset, setActivePreset] = useState<number | null>(
    DEFAULT_PRESET_DAYS,
  );

  const validationMessage = validateStatisticsDateRange(range);
  const canFetch = validationMessage === null;

  const overviewQuery = useClubStatisticsOverview(
    range.startDate,
    range.endDate,
    { enabled: canFetch },
  );
  const trendQuery = useClubStatisticsTrend(range.startDate, range.endDate, {
    enabled: canFetch,
  });
  const searchKeywordQuery = useSearchKeywordStatistics(
    range.startDate,
    range.endDate,
    SEARCH_KEYWORD_LIMIT,
    { enabled: canFetch },
  );

  const handlePresetSelect = (days: number) => {
    setRange(getRecentDateRange(days));
    setActivePreset(days);
  };

  const handleRangeChange = (nextRange: StatisticsDateRange) => {
    setRange(nextRange);
    setActivePreset(null);
  };

  return (
    <Styled.Container>
      {(isMobile || isTablet) && (
        <WebviewTopBar title='통계' onBack={() => navigate('/admin')} />
      )}
      <Styled.Content>
      <ContentSection>
        <ContentSection.Body>
          <PeriodSelector
            range={range}
            activePreset={activePreset}
            validationMessage={validationMessage}
            onPresetSelect={handlePresetSelect}
            onRangeChange={handleRangeChange}
          />
          {canFetch && (
            <MetricSummary
              data={overviewQuery.data}
              isLoading={overviewQuery.isLoading}
              isError={overviewQuery.isError}
              onRetry={overviewQuery.refetch}
            />
          )}
        </ContentSection.Body>
      </ContentSection>

      {canFetch && (
        <>
          <Styled.Section>
            <Styled.SectionHeader>
              <div>
                <Styled.SectionTitle>일자별 추이</Styled.SectionTitle>
                <Styled.SectionDescription>
                  상세 조회수와 지원자 수를 날짜별로 비교합니다.
                </Styled.SectionDescription>
              </div>
            </Styled.SectionHeader>
            <Styled.Panel>
              <TrendChart
                data={trendQuery.data}
                isLoading={trendQuery.isLoading}
                isError={trendQuery.isError}
                onRetry={trendQuery.refetch}
              />
            </Styled.Panel>
          </Styled.Section>

          <Styled.Section>
            <Styled.SectionHeader>
              <div>
                <Styled.SectionTitle>전체 주요 검색어</Styled.SectionTitle>
                <Styled.SectionDescription>
                  선택한 기간 동안 전체 사용자가 많이 검색한 키워드입니다.
                </Styled.SectionDescription>
              </div>
            </Styled.SectionHeader>
            <Styled.Panel>
              <KeywordRanking
                data={searchKeywordQuery.data}
                isLoading={searchKeywordQuery.isLoading}
                isError={searchKeywordQuery.isError}
                onRetry={searchKeywordQuery.refetch}
              />
            </Styled.Panel>
          </Styled.Section>
        </>
      )}
      </Styled.Content>
    </Styled.Container>
  );
};

export default StatisticsTab;

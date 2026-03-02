import { useState } from 'react';
import Footer from '@/components/common/Footer/Footer';
import Header from '@/components/common/Header/Header';
import UnderlineTabs from '@/components/common/UnderlineTabs/UnderlineTabs';
import { PAGE_VIEW } from '@/constants/eventName';
import useTrackPageView from '@/hooks/Mixpanel/useTrackPageView';
import BoothMapSection from '@/pages/FestivalPage/components/BoothMapSection/BoothMapSection';
import PerformanceList from '@/pages/FestivalPage/components/PerformanceList/PerformanceList';
import Filter from '@/pages/MainPage/components/Filter/Filter';
import isInAppWebView from '@/utils/isInAppWebView';
import * as Styled from './IntroductionPage.styles';

const FESTIVAL_TAB_TYPE = {
  BOOTH_MAP: 'booth-map',
  CLUB_TIMETABLE: 'club-timetable',
} as const;

type FestivalTabType =
  (typeof FESTIVAL_TAB_TYPE)[keyof typeof FESTIVAL_TAB_TYPE];

const IntroductionPage = () => {
  useTrackPageView(PAGE_VIEW.FESTIVAL_INTRODUCTION_PAGE);
  const [activeTab, setActiveTab] = useState<FestivalTabType>(
    FESTIVAL_TAB_TYPE.BOOTH_MAP,
  );

  return (
    <>
      <Header hideOn={['webview']} />
      <Styled.Container>
        {!isInAppWebView() && <Filter alwaysVisible />}
        <Styled.TabWrapper>
          <UnderlineTabs
            tabs={[
              { key: FESTIVAL_TAB_TYPE.BOOTH_MAP, label: '부스지도' },
              { key: FESTIVAL_TAB_TYPE.CLUB_TIMETABLE, label: '동아리시간표' },
            ]}
            activeKey={activeTab}
            onTabClick={(tabKey) => setActiveTab(tabKey as FestivalTabType)}
            centerOnMobile
          />
        </Styled.TabWrapper>
        {activeTab === FESTIVAL_TAB_TYPE.BOOTH_MAP ? (
          <BoothMapSection />
        ) : (
          <Styled.TimetableSection>
            <Styled.TimetableHeader>
              <Styled.TimetableDate>
                2026.03.05 (목) 12:30 - 18:00
              </Styled.TimetableDate>
              <Styled.TimetableLocation>
                공연 장소: 충무관 B13동 앞 메인무대
              </Styled.TimetableLocation>
            </Styled.TimetableHeader>
            <PerformanceList />
          </Styled.TimetableSection>
        )}
      </Styled.Container>
      <Footer />
    </>
  );
};

export default IntroductionPage;

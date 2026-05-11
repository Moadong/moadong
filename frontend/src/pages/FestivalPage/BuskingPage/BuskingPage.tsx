import { useEffect, useRef, useState } from 'react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import Filter from '@/components/common/Filter/Filter';
import Footer from '@/components/common/Footer/Footer';
import Header from '@/components/common/Header/Header';
import { PAGE_VIEW, USER_EVENT } from '@/constants/eventName';
import { festivalTimetableNavExperiment } from '@/experiments/definitions';
import { useExperimentVariant } from '@/hooks/Experiment/useExperimentVariant';
import useMixpanelTrack from '@/hooks/Mixpanel/useMixpanelTrack';
import useTrackPageView from '@/hooks/Mixpanel/useTrackPageView';
import usePromotionNotification from '@/hooks/Queries/usePromotionNotification';
import isInAppWebView from '@/utils/isInAppWebView';
import DayArrowsNav from '../components/DayArrowsNav/DayArrowsNav';
import DayTabsNav from '../components/DayTabsNav/DayTabsNav';
import PerformanceList from '../components/PerformanceList/PerformanceList';
import { BUSKING_DAYS } from '../data/buskingDays';
import * as Styled from './BuskingPage.styles';

const availableDays = BUSKING_DAYS.filter(
  (d) =>
    d.performances.length > 0 || (d.mainStagePerformances?.length ?? 0) > 0,
);

const getInitialDayId = (): string => {
  const now = new Date();
  const todayStr = format(now, 'yyyy-MM-dd');
  return (
    availableDays.find((d) => d.date === todayStr)?.id ??
    availableDays[0]?.id ??
    BUSKING_DAYS[0].id
  );
};

const BuskingPage = () => {
  useTrackPageView(PAGE_VIEW.DAEDONG2026_BUSKING_PAGE);
  const trackEvent = useMixpanelTrack();
  const navVariant = useExperimentVariant(festivalTimetableNavExperiment);

  const hasNotification = usePromotionNotification();
  const [activeDayId, setActiveDayId] = useState(getInitialDayId);
  const dayStartTime = useRef(Date.now());
  const activeDayIdRef = useRef(activeDayId);

  const activeDay = BUSKING_DAYS.find((d) => d.id === activeDayId)!;

  useEffect(() => {
    activeDayIdRef.current = activeDayId;
  }, [activeDayId]);

  useEffect(() => {
    return () => {
      const duration = Date.now() - dayStartTime.current;
      trackEvent(USER_EVENT.DAEDONG2026_DAY_DURATION, {
        day: activeDayIdRef.current,
        nav_variant: navVariant,
        duration,
        duration_seconds: Math.round(duration / 1000),
      });
    };
  }, []);

  const handleDayChange = (
    dayId: string,
    interaction: 'click' | 'swipe' = 'click',
  ) => {
    const duration = Date.now() - dayStartTime.current;
    trackEvent(USER_EVENT.DAEDONG2026_DAY_DURATION, {
      day: activeDayId,
      nav_variant: navVariant,
      duration,
      duration_seconds: Math.round(duration / 1000),
    });
    trackEvent(USER_EVENT.DAEDONG2026_DAY_CHANGED, {
      from_day: activeDayId,
      to_day: dayId,
      nav_variant: navVariant,
      interaction,
    });
    dayStartTime.current = Date.now();
    setActiveDayId(dayId);
  };

  const handleSwipe = (direction: 'left' | 'right') => {
    const currentIndex = availableDays.findIndex((d) => d.id === activeDayId);
    if (direction === 'left' && currentIndex < availableDays.length - 1) {
      handleDayChange(availableDays[currentIndex + 1].id, 'swipe');
    } else if (direction === 'right' && currentIndex > 0) {
      handleDayChange(availableDays[currentIndex - 1].id, 'swipe');
    }
  };

  return (
    <Styled.PageWrapper>
      <Header hideOn={['webview']} />
      <Filter hasNotification={hasNotification} />
      <Styled.Container>
        <Styled.NavWrapper>
          {navVariant === 'tabs' ? (
            <DayTabsNav
              days={availableDays}
              activeDayId={activeDayId}
              onChange={handleDayChange}
            />
          ) : (
            <DayArrowsNav
              days={availableDays}
              activeDayId={activeDayId}
              onChange={handleDayChange}
            />
          )}
        </Styled.NavWrapper>
        <motion.div
          onPanEnd={(_, info) => {
            const SWIPE_THRESHOLD = 50;
            if (info.offset.x < -SWIPE_THRESHOLD) handleSwipe('left');
            else if (info.offset.x > SWIPE_THRESHOLD) handleSwipe('right');
          }}
        >
          <Styled.TimetableSection>
            <Styled.TimetableHeader>
              <Styled.TimetableDate>
                {activeDay.fullDateLabel} {activeDay.timeRange}
              </Styled.TimetableDate>
              <Styled.TimetableLocation>
                공연 장소: {activeDay.location}
              </Styled.TimetableLocation>
            </Styled.TimetableHeader>
            {activeDay.performances.length > 0 && (
              <>
                {(activeDay.mainStagePerformances?.length ?? 0) > 0 && (
                  <Styled.SectionLabel>동아리 공연</Styled.SectionLabel>
                )}
                <PerformanceList
                  key={`${activeDayId}-club`}
                  performances={activeDay.performances}
                  festivalDate={activeDay.date}
                />
              </>
            )}
            {(activeDay.mainStagePerformances?.length ?? 0) > 0 && (
              <>
                <Styled.SectionLabel>🎤 아티스트 공연</Styled.SectionLabel>
                <PerformanceList
                  key={`${activeDayId}-main`}
                  performances={activeDay.mainStagePerformances!}
                  festivalDate={activeDay.date}
                  hideSongs
                />
              </>
            )}
          </Styled.TimetableSection>
        </motion.div>
      </Styled.Container>
      {!isInAppWebView() && <Footer />}
    </Styled.PageWrapper>
  );
};

export default BuskingPage;

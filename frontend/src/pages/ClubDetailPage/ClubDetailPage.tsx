import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import LocationIcon from '@/assets/images/icons/location_icon.svg?react';
import Footer from '@/components/common/Footer/Footer';
import Header from '@/components/common/Header/Header';
import UnderlineTabs from '@/components/common/UnderlineTabs/UnderlineTabs';
import MapModal from '@/components/map/MapModal/MapModal';
import NaverMap from '@/components/map/NaverMap/NaverMap';
import { clubLocations } from '@/constants/clubLocation';
import { PAGE_VIEW, USER_EVENT } from '@/constants/eventName';
import useMixpanelTrack from '@/hooks/Mixpanel/useMixpanelTrack';
import useTrackPageView from '@/hooks/Mixpanel/useTrackPageView';
import {
  useGetClubCalendarEvents,
  useGetClubDetail,
} from '@/hooks/Queries/useClub';
import { useScrollTo } from '@/hooks/Scroll/useScrollTo';
import useDevice from '@/hooks/useDevice';
import ClubFeed from '@/pages/ClubDetailPage/components/ClubFeed/ClubFeed';
import ClubIntroContent from '@/pages/ClubDetailPage/components/ClubIntroContent/ClubIntroContent';
import ClubProfileCard from '@/pages/ClubDetailPage/components/ClubProfileCard/ClubProfileCard';
import ClubScheduleCalendar from '@/pages/ClubDetailPage/components/ClubScheduleCalendar/ClubScheduleCalendar';
import isInAppWebView from '@/utils/isInAppWebView';
import * as Styled from './ClubDetailPage.styles';
import ClubDetailFooter from './components/ClubDetailFooter/ClubDetailFooter';
import ClubDetailTopBar from './components/ClubDetailTopBar/ClubDetailTopBar';

export const TAB_TYPE = {
  INTRO: 'intro',
  PHOTOS: 'photos',
  SCHEDULE: 'schedule',
} as const;

type TabType = (typeof TAB_TYPE)[keyof typeof TAB_TYPE];

// 탭 클릭 시 스크롤이 탑바 하단에 정확히 위치하도록 하는 높이 값
const TOP_BAR_HEIGHT = 50;
// 인라인 탭이 TopBar 뒤로 가려지는 시점을 감지하는 IntersectionObserver rootMargin 값 (TopBarContent 60px + 하단 여백)
const TOP_BAR_RENDERED_HEIGHT = 73;

const ClubDetailPage = () => {
  const trackEvent = useMixpanelTrack();

  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab') as TabType | null;

  const { clubId, clubName } = useParams<{
    clubId: string;
    clubName: string;
  }>();
  const { isMobile, isTablet } = useDevice();
  const showTopBar = isMobile || isTablet;

  const { data: clubDetail, error } = useGetClubDetail(
    (clubName ?? clubId) || '',
  );

  const hasCalendarConnection = clubDetail?.hasCalendarConnection ?? false;

  const activeTab: TabType = useMemo(() => {
    if (!tabParam || !Object.values(TAB_TYPE).includes(tabParam)) {
      return TAB_TYPE.INTRO;
    }
    return tabParam;
  }, [tabParam]);

  const { data: calendarEvents = [] } = useGetClubCalendarEvents(
    (clubName ?? clubId) || '',
    { enabled: hasCalendarConnection && activeTab === TAB_TYPE.SCHEDULE },
  );

  const tabs = useMemo(
    () => [
      { key: TAB_TYPE.INTRO, label: '소개내용' },
      { key: TAB_TYPE.PHOTOS, label: '활동사진' },
      { key: TAB_TYPE.SCHEDULE, label: '행사일정' },
    ],
    [],
  );

  useTrackPageView(
    PAGE_VIEW.CLUB_DETAIL_PAGE,
    clubDetail?.name,
    !clubDetail,
    clubDetail?.recruitmentStatus,
  );

  const [showStickyTabs, setShowStickyTabs] = useState(false);
  const [inlineTabsEl, setInlineTabsEl] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!showTopBar || !inlineTabsEl) return;

    // top < TOP_BAR_RENDERED_HEIGHT: viewport가 좁아 탭이 아래에 있는 경우를 제외하고 sticky 활성화
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (
          !entry.isIntersecting &&
          entry.boundingClientRect.top < TOP_BAR_RENDERED_HEIGHT
        ) {
          setShowStickyTabs(true);
        } else {
          setShowStickyTabs(false);
        }
      },
      { rootMargin: `-${TOP_BAR_RENDERED_HEIGHT}px 0px 0px 0px`, threshold: 1 },
    );
    observer.observe(inlineTabsEl);
    return () => observer.disconnect();
  }, [showTopBar, inlineTabsEl]);

  const contentRef = useRef<HTMLDivElement>(null);
  const { scrollToElement } = useScrollTo();

  const scrollToContent = useCallback(() => {
    scrollToElement(contentRef.current, TOP_BAR_HEIGHT);
  }, [scrollToElement]);

  const handleTabClick = useCallback(
    (tabKey: TabType) => {
      setSearchParams({ tab: tabKey }, { replace: true });
      trackEvent(
        tabKey === TAB_TYPE.INTRO
          ? USER_EVENT.CLUB_INTRO_TAB_CLICKED
          : tabKey === TAB_TYPE.PHOTOS
            ? USER_EVENT.CLUB_FEED_TAB_CLICKED
            : USER_EVENT.CLUB_SCHEDULE_TAB_CLICKED,
      );
    },
    [setSearchParams, trackEvent],
  );

  const clubLocation = clubLocations.find(
    (loc) => loc.clubName === clubDetail?.name,
  );

  const [isMapModalOpen, setIsMapModalOpen] = useState(false);

  if (error) {
    return <div>동아리 정보를 불러오는데 실패했습니다.</div>;
  }

  if (!clubDetail) {
    return null;
  }

  return (
    <>
      <Header hideOn={['mobile', 'tablet']} />
      {showTopBar && (
        <ClubDetailTopBar
          clubId={clubDetail.id}
          clubName={clubDetail.name}
          tabs={tabs}
          activeTab={activeTab}
          onTabClick={(tabKey) => {
            handleTabClick(tabKey as TabType);
            scrollToContent();
          }}
          initialIsSubscribed={searchParams.get('is_subscribed') === 'true'}
          showTabs={showStickyTabs}
        />
      )}
      <Styled.Container>
        <Styled.ContentWrapper>
          <Styled.LeftSection>
            <ClubProfileCard
              name={clubDetail.name}
              logo={clubDetail.logo}
              cover={clubDetail.cover}
              category={clubDetail.category}
              recruitmentStatus={clubDetail.recruitmentStatus}
              socialLinks={clubDetail.socialLinks}
              introDescription={clubDetail.description.introDescription}
              location={clubLocation}
              onMapClick={() => {
                setIsMapModalOpen(true);
                trackEvent(USER_EVENT.CLUB_MAP_CLICKED);
              }}
            />
            {clubLocation && (
              <Styled.MapInfo>
                <Styled.MapCard
                  onClick={() => {
                    setIsMapModalOpen(true);
                    trackEvent(USER_EVENT.CLUB_MAP_CLICKED);
                  }}
                >
                  <NaverMap location={clubLocation} />
                </Styled.MapCard>

                <Styled.MapDetailText>
                  <LocationIcon />
                  동아리방 위치 {clubLocation.building}{' '}
                  {clubLocation.detailLocation}
                </Styled.MapDetailText>
              </Styled.MapInfo>
            )}
          </Styled.LeftSection>

          <Styled.RightSection ref={contentRef}>
            <Styled.InlineTabsWrapper
              ref={setInlineTabsEl}
              $hidden={showTopBar && showStickyTabs}
            >
              <UnderlineTabs
                tabs={tabs}
                activeKey={activeTab}
                onTabClick={(tabKey) => handleTabClick(tabKey as TabType)}
                centerOnMobile
              />
            </Styled.InlineTabsWrapper>

            <Styled.TabContent>
              <div
                style={{
                  display: activeTab === TAB_TYPE.INTRO ? 'block' : 'none',
                }}
              >
                <ClubIntroContent {...clubDetail.description} />
              </div>
              <div
                style={{
                  display: activeTab === TAB_TYPE.PHOTOS ? 'block' : 'none',
                }}
              >
                <ClubFeed feed={clubDetail.feeds} clubName={clubDetail.name} />
              </div>
              <div
                style={{
                  display: activeTab === TAB_TYPE.SCHEDULE ? 'block' : 'none',
                }}
              >
                <ClubScheduleCalendar
                  key={clubId ?? clubName}
                  events={calendarEvents}
                />
              </div>
            </Styled.TabContent>
          </Styled.RightSection>
        </Styled.ContentWrapper>
      </Styled.Container>
      {clubLocation && (
        <MapModal
          isOpen={isMapModalOpen}
          onClose={() => setIsMapModalOpen(false)}
          clubName={clubDetail.name}
          clubLogo={clubDetail.logo}
          location={clubLocation}
        />
      )}
      {isInAppWebView() ? <Styled.AppSpacer /> : <Footer />}
      <ClubDetailFooter
        recruitmentStart={clubDetail.recruitmentStart}
        recruitmentEnd={clubDetail.recruitmentEnd}
        recruitmentStatus={clubDetail.recruitmentStatus}
      />
    </>
  );
};

export default ClubDetailPage;

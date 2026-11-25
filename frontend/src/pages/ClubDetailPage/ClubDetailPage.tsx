import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useParams, useSearchParams } from 'react-router-dom';
import Footer from '@/components/common/Footer/Footer';
import Header from '@/components/common/Header/Header';
import { HEADER_HEIGHT } from '@/components/common/Header/Header.styles';
import UnderlineTabs from '@/components/common/UnderlineTabs/UnderlineTabs';
import MapModal from '@/components/map/MapModal/MapModal';
import NaverMap from '@/components/map/NaverMap/NaverMap';
import { clubLocations } from '@/constants/clubLocation';
import { PAGE_VIEW, USER_EVENT } from '@/constants/eventName';
import { registerClubDetailVisit } from '@/feedbackPrompt/clubDetailVisit';
import useTrackClubDetailDuration from '@/hooks/Analytics/useTrackClubDetailDuration';
import useMixpanelTrack from '@/hooks/Mixpanel/useMixpanelTrack';
import useTrackPageView from '@/hooks/Mixpanel/useTrackPageView';
import {
  useGetClubCalendarEvents,
  useGetClubDetail,
} from '@/hooks/Queries/useClub';
import { useScrollTo } from '@/hooks/Scroll/useScrollTo';
import useDevice from '@/hooks/useDevice';
import useNavigator from '@/hooks/useNavigator';
import { countClubView } from '@/hooks/useSatisfactionSurvey';
import ClubFeed from '@/pages/ClubDetailPage/components/ClubFeed/ClubFeed';
import ClubHomeTab from '@/pages/ClubDetailPage/components/ClubHomeTab/ClubHomeTab';
import ClubInfoList from '@/pages/ClubDetailPage/components/ClubInfoList/ClubInfoList';
import ClubPhotoHero from '@/pages/ClubDetailPage/components/ClubPhotoHero/ClubPhotoHero';
import ClubScheduleCalendar from '@/pages/ClubDetailPage/components/ClubScheduleCalendar/ClubScheduleCalendar';
import ClubSummary from '@/pages/ClubDetailPage/components/ClubSummary/ClubSummary';
import {
  getRecruitmentSummary,
  getUpdatedLabel,
} from '@/pages/ClubDetailPage/utils/clubDetailSummary';
import isInAppWebView from '@/utils/isInAppWebView';
import * as Styled from './ClubDetailPage.styles';
import ClubApplyButton from './components/ClubApplyButton/ClubApplyButton';
import ClubDetailTopBar from './components/ClubDetailTopBar/ClubDetailTopBar';

export const TAB_TYPE = {
  INTRO: 'intro',
  PHOTOS: 'photos',
  SCHEDULE: 'schedule',
} as const;

type TabType = (typeof TAB_TYPE)[keyof typeof TAB_TYPE];

type SocialPlatform = 'instagram' | 'youtube';

// 탭 클릭 시 스크롤이 탑바 하단에 정확히 위치하도록 하는 높이 값
const TOP_BAR_HEIGHT = 50;
// 인라인 탭이 TopBar 뒤로 가려지는 시점을 감지하는 IntersectionObserver rootMargin 값 (TopBarContent 60px + 하단 여백)
const TOP_BAR_RENDERED_HEIGHT = 73;

const ClubDetailPage = () => {
  const location = useLocation();
  const trackEvent = useMixpanelTrack();
  const handleLink = useNavigator();

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

  const { data: calendarEvents = [], isLoading: isCalendarLoading } =
    useGetClubCalendarEvents((clubName ?? clubId) || '', {
      enabled: hasCalendarConnection && activeTab === TAB_TYPE.SCHEDULE,
    });

  const feedCount = clubDetail?.feeds.length ?? 0;
  const tabs = useMemo(
    () => [
      { key: TAB_TYPE.INTRO, label: '홈' },
      {
        key: TAB_TYPE.PHOTOS,
        label: feedCount > 0 ? `사진 ${feedCount}` : '사진',
      },
      { key: TAB_TYPE.SCHEDULE, label: '일정' },
    ],
    [feedCount],
  );

  useTrackPageView(PAGE_VIEW.CLUB_DETAIL_PAGE, {
    clubId: clubDetail?.id,
    clubName: clubDetail?.name,
    recruitmentStatus: clubDetail?.recruitmentStatus,
    skip: !clubDetail,
  });
  useTrackClubDetailDuration({
    clubId: clubDetail?.id,
    clubName: clubDetail?.name,
    skip: !clubDetail,
  });

  // 만족도 모달 노출 조건. 같은 동아리를 다시 렌더해도 한 번만 센다.
  const countedClubIdRef = useRef<string | null>(null);
  useEffect(() => {
    const clubId = clubDetail?.id;
    if (!clubId || countedClubIdRef.current === clubId) return;

    countedClubIdRef.current = clubId;
    countClubView();
  }, [clubDetail?.id]);

  useEffect(() => {
    if (clubDetail?.id && !error)
      registerClubDetailVisit(clubDetail.id, location.pathname);
  }, [clubDetail?.id, error, location.pathname]);

  /**
   * 일정 탭에 실제로 도달했을 때 볼 일정이 있었는지 남긴다.
   * 탭 클릭뿐 아니라 `?tab=schedule` 딥링크 진입도 포함해야 해서 탭 클릭 이벤트와 별개로 둔다.
   */
  const scheduleViewedClubIdRef = useRef<string | null>(null);
  useEffect(() => {
    const viewedClubId = clubDetail?.id;
    if (activeTab !== TAB_TYPE.SCHEDULE || !viewedClubId || isCalendarLoading) {
      return;
    }
    if (scheduleViewedClubIdRef.current === viewedClubId) return;

    scheduleViewedClubIdRef.current = viewedClubId;
    trackEvent(USER_EVENT.CLUB_SCHEDULE_CALENDAR_VIEWED, {
      club_id: viewedClubId,
      club_name: clubDetail?.name,
      event_count: calendarEvents.length,
      has_calendar_connection: hasCalendarConnection,
    });
  }, [
    activeTab,
    clubDetail?.id,
    clubDetail?.name,
    isCalendarLoading,
    calendarEvents.length,
    hasCalendarConnection,
    trackEvent,
  ]);

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
    scrollToElement(
      contentRef.current,
      showTopBar ? TOP_BAR_HEIGHT : HEADER_HEIGHT.desktop,
    );
  }, [scrollToElement, showTopBar]);

  const handleTabClick = useCallback(
    (tabKey: TabType) => {
      setSearchParams({ tab: tabKey }, { replace: true });
      trackEvent(USER_EVENT.CLUB_DETAIL_TAB_CLICKED, {
        tab: tabKey,
        club_id: clubDetail?.id,
        club_name: clubDetail?.name,
      });
    },
    [setSearchParams, trackEvent, clubDetail?.id, clubDetail?.name],
  );

  // 요약의 '행사일정'·홈의 '전체보기'처럼 본문 밖에서 탭을 바꿀 때는 탭 위치까지 내려준다
  const goToTab = (tabKey: TabType) => {
    handleTabClick(tabKey);
    scrollToContent();
  };

  const clubLocation = clubLocations.find(
    (loc) => loc.clubName === clubDetail?.name,
  );

  const [isMapModalOpen, setIsMapModalOpen] = useState(false);

  if (error) {
    return (
      <>
        <Header hideOn={['mobile', 'tablet']} />
        <Styled.ErrorMessage>
          동아리 정보를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.
        </Styled.ErrorMessage>
      </>
    );
  }

  if (!clubDetail) {
    return null;
  }

  const recruitment = getRecruitmentSummary(
    clubDetail.recruitmentStatus,
    clubDetail.recruitmentStart,
    clubDetail.recruitmentEnd,
  );
  const updatedLabel = getUpdatedLabel(clubDetail.lastModifiedDate);

  const socialLinks = (['instagram', 'youtube'] as const)
    .map((platform) => ({
      platform,
      url: clubDetail.socialLinks?.[platform]?.trim() ?? '',
    }))
    .filter(({ url }) => !!url);
  const instagramUrl = socialLinks.find((s) => s.platform === 'instagram')?.url;
  const youtubeUrl = socialLinks.find((s) => s.platform === 'youtube')?.url;

  const handleSocialClick = (platform: SocialPlatform, url: string) => {
    trackEvent(USER_EVENT.SNS_LINK_BUTTON_CLICKED, {
      sns_platform: platform,
      club_id: clubDetail.id,
      club_name: clubDetail.name,
    });
    handleLink(url);
  };

  const openMap = () => {
    setIsMapModalOpen(true);
    trackEvent(USER_EVENT.CLUB_MAP_CLICKED, {
      club_id: clubDetail.id,
      club_name: clubDetail.name,
    });
  };

  const mapCard = clubLocation && (
    <div>
      <Styled.MapCard
        type='button'
        onClick={openMap}
        aria-label={`${clubDetail.name} 동아리방 지도 크게 보기`}
      >
        <NaverMap location={clubLocation} />
      </Styled.MapCard>
      <Styled.MapCaption>
        {clubLocation.building} {clubLocation.detailLocation}
      </Styled.MapCaption>
    </div>
  );

  const infoListProps = {
    recruitment,
    recruitmentTarget: clubDetail.recruitmentTarget,
    location: clubLocation,
    onMapClick: clubLocation ? openMap : undefined,
    socialLinks,
    onSocialClick: handleSocialClick,
    updatedLabel,
  };

  return (
    <>
      <Header hideOn={['mobile', 'tablet']} />
      {showTopBar && (
        <ClubDetailTopBar
          clubId={clubDetail.id}
          clubName={clubDetail.name}
          tabs={tabs}
          activeTab={activeTab}
          onTabClick={(tabKey) => goToTab(tabKey as TabType)}
          initialIsSubscribed={searchParams.get('is_subscribed') === 'true'}
          showTabs={showStickyTabs}
        />
      )}
      <Styled.Page>
        <Styled.Inner>
          <ClubPhotoHero
            clubName={clubDetail.name}
            logo={clubDetail.logo}
            cover={clubDetail.cover}
            feeds={clubDetail.feeds}
            category={clubDetail.category}
          />

          <Styled.Columns>
            <Styled.Main>
              <ClubSummary
                name={clubDetail.name}
                logo={clubDetail.logo}
                category={clubDetail.category}
                division={clubDetail.division}
                introduction={clubDetail.introduction}
                tags={clubDetail.tags}
                recruitmentStatus={clubDetail.recruitmentStatus}
                recruitment={recruitment}
                instagramUrl={instagramUrl}
                youtubeUrl={youtubeUrl}
                onSocialClick={handleSocialClick}
                onLocationClick={clubLocation ? openMap : undefined}
                onScheduleClick={() => goToTab(TAB_TYPE.SCHEDULE)}
              />

              {showTopBar && (
                <>
                  <ClubInfoList {...infoListProps} />
                  <Styled.Divider />
                </>
              )}

              <Styled.TabArea ref={contentRef}>
                <Styled.TabsWrapper
                  ref={setInlineTabsEl}
                  $hidden={showTopBar && showStickyTabs}
                >
                  <UnderlineTabs
                    tabs={tabs}
                    activeKey={activeTab}
                    onTabClick={(tabKey) => handleTabClick(tabKey as TabType)}
                    centerOnMobile
                  />
                </Styled.TabsWrapper>

                <Styled.TabContent>
                  <div
                    style={{
                      display: activeTab === TAB_TYPE.INTRO ? 'block' : 'none',
                    }}
                  >
                    <ClubHomeTab
                      clubId={clubDetail.id}
                      clubName={clubDetail.name}
                      description={clubDetail.description}
                      feeds={clubDetail.feeds}
                      onShowAllPhotos={() => goToTab(TAB_TYPE.PHOTOS)}
                      locationSlot={showTopBar ? mapCard : undefined}
                    />
                  </div>
                  <div
                    style={{
                      display: activeTab === TAB_TYPE.PHOTOS ? 'block' : 'none',
                    }}
                  >
                    <ClubFeed
                      feed={clubDetail.feeds}
                      clubName={clubDetail.name}
                    />
                  </div>
                  <div
                    style={{
                      display:
                        activeTab === TAB_TYPE.SCHEDULE ? 'block' : 'none',
                    }}
                  >
                    <ClubScheduleCalendar
                      key={clubId ?? clubName}
                      events={calendarEvents}
                      isLoading={isCalendarLoading}
                      clubId={clubDetail.id}
                    />
                  </div>
                </Styled.TabContent>
              </Styled.TabArea>
            </Styled.Main>

            {!showTopBar && (
              <Styled.Aside>
                <ClubInfoList {...infoListProps} variant='card' />
                {mapCard}
              </Styled.Aside>
            )}
          </Styled.Columns>
        </Styled.Inner>
      </Styled.Page>
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
      <ClubApplyButton />
    </>
  );
};

export default ClubDetailPage;

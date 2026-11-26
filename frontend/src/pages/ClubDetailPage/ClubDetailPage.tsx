import { useEffect, useRef, useState } from 'react';
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import Footer from '@/components/common/Footer/Footer';
import Header from '@/components/common/Header/Header';
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
import useDevice from '@/hooks/useDevice';
import useNavigator from '@/hooks/useNavigator';
import { countClubView } from '@/hooks/useSatisfactionSurvey';
import ClubDetailBody, {
  CLUB_SECTION_ID,
} from '@/pages/ClubDetailPage/components/ClubDetailBody/ClubDetailBody';
import ClubInfoList from '@/pages/ClubDetailPage/components/ClubInfoList/ClubInfoList';
import ClubPhotoHero from '@/pages/ClubDetailPage/components/ClubPhotoHero/ClubPhotoHero';
import ClubScheduleCalendar from '@/pages/ClubDetailPage/components/ClubScheduleCalendar/ClubScheduleCalendar';
import ClubSummary from '@/pages/ClubDetailPage/components/ClubSummary/ClubSummary';
import {
  Emoji,
  SwapTossfaceFont,
} from '@/pages/ClubDetailPage/components/SwapTossface/SwapTossface';
import useClubInsights from '@/pages/ClubDetailPage/hooks/useClubInsights';
import {
  getDeadlineCountdown,
  getRecruitmentSummary,
  getUpdatedLabel,
} from '@/pages/ClubDetailPage/utils/clubDetailSummary';
import { TAG_COLORS } from '@/styles/clubTags';
import isInAppWebView from '@/utils/isInAppWebView';
import * as Styled from './ClubDetailPage.styles';
import ClubApplyButton from './components/ClubApplyButton/ClubApplyButton';
import ClubApplyCard from './components/ClubApplyCard/ClubApplyCard';
import ClubDetailTopBar from './components/ClubDetailTopBar/ClubDetailTopBar';

// 예전 탭 주소(`?tab=schedule`)로 들어오면 해당 섹션으로 내려준다.
// `?tab=photos`는 사진을 맡는 맨 위 모자이크가 이미 보이니 스크롤하지 않는다
const LEGACY_TAB_SECTION: Record<string, string> = {
  schedule: CLUB_SECTION_ID.SCHEDULE,
};

type SocialPlatform = 'instagram' | 'youtube';

const scrollToSection = (sectionId: string) => {
  document
    .getElementById(sectionId)
    ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

const ClubDetailPage = () => {
  const location = useLocation();
  const trackEvent = useMixpanelTrack();
  const handleLink = useNavigator();
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');

  const { clubId, clubName } = useParams<{
    clubId: string;
    clubName: string;
  }>();
  const { isMobile, isTablet } = useDevice();
  const isCompact = isMobile || isTablet;

  const { data: clubDetail, error } = useGetClubDetail(
    (clubName ?? clubId) || '',
  );
  const insights = useClubInsights(clubDetail?.id);

  const hasCalendarConnection = clubDetail?.hasCalendarConnection ?? false;

  const { data: calendarEvents = [], isLoading: isCalendarLoading } =
    useGetClubCalendarEvents((clubName ?? clubId) || '', {
      enabled: hasCalendarConnection,
    });

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

  // 예전 탭 딥링크는 데이터가 그려진 뒤 한 번만 해당 섹션으로 스크롤한다
  const deepLinkedRef = useRef(false);
  useEffect(() => {
    if (!clubDetail || deepLinkedRef.current || !tabParam) return;
    const sectionId = LEGACY_TAB_SECTION[tabParam];
    if (!sectionId) return;
    deepLinkedRef.current = true;
    requestAnimationFrame(() => scrollToSection(sectionId));
  }, [clubDetail, tabParam]);

  /**
   * 일정 섹션이 실제로 화면에 들어왔을 때 볼 일정이 있었는지 남긴다.
   * 탭이 없어졌으니 '일정 탭 도달' 대신 '일정 섹션 노출'로 같은 이벤트를 보낸다.
   */
  const [isScheduleVisible, setIsScheduleVisible] = useState(false);
  useEffect(() => {
    const el = clubDetail
      ? document.getElementById(CLUB_SECTION_ID.SCHEDULE)
      : null;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setIsScheduleVisible(true);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [clubDetail]);

  const scheduleViewedClubIdRef = useRef<string | null>(null);
  useEffect(() => {
    const viewedClubId = clubDetail?.id;
    if (!isScheduleVisible || !viewedClubId || isCalendarLoading) return;
    if (scheduleViewedClubIdRef.current === viewedClubId) return;

    scheduleViewedClubIdRef.current = viewedClubId;
    trackEvent(USER_EVENT.CLUB_SCHEDULE_CALENDAR_VIEWED, {
      club_id: viewedClubId,
      club_name: clubDetail?.name,
      event_count: calendarEvents.length,
      has_calendar_connection: hasCalendarConnection,
    });
  }, [
    isScheduleVisible,
    clubDetail?.id,
    clubDetail?.name,
    isCalendarLoading,
    calendarEvents.length,
    hasCalendarConnection,
    trackEvent,
  ]);

  const clubLocation = clubLocations.find(
    (loc) => loc.clubName === clubDetail?.name,
  );

  const [isMapModalOpen, setIsMapModalOpen] = useState(false);

  // 일정이 하나도 없으면 섹션과 바로가기를 숨긴다. '곧 업데이트'처럼 확인 못 하는 약속은 하지 않는다
  const hasSchedule =
    hasCalendarConnection && (isCalendarLoading || calendarEvents.length > 0);

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
  const countdown = getDeadlineCountdown(
    clubDetail.recruitmentStatus,
    clubDetail.recruitmentStart,
    clubDetail.recruitmentEnd,
  );

  const goToApplyGuide = () => {
    trackEvent(USER_EVENT.CLUB_APPLY_BUTTON_CLICKED, {
      club_id: clubDetail.id,
      club_name: clubDetail.name,
    });
    navigate('apply');
  };

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
    updatedLabel,
  };

  const topKeyword = insights?.keywords?.keywords
    .slice()
    .sort((a, b) => b.count - a.count)[0];

  return (
    <>
      <SwapTossfaceFont />
      <Header hideOn={['mobile', 'tablet']} />
      {isCompact && (
        <ClubDetailTopBar
          clubId={clubDetail.id}
          clubName={clubDetail.name}
          initialIsSubscribed={searchParams.get('is_subscribed') === 'true'}
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
                onLocationClick={
                  clubLocation
                    ? () => scrollToSection(CLUB_SECTION_ID.LOCATION)
                    : undefined
                }
                onScheduleClick={
                  hasSchedule
                    ? () => scrollToSection(CLUB_SECTION_ID.SCHEDULE)
                    : undefined
                }
              />

              {topKeyword && (
                <Styled.Highlight
                  $color={TAG_COLORS[clubDetail.category] ?? undefined}
                >
                  <Emoji aria-hidden>{topKeyword.emoji}</Emoji>
                  <span>
                    부원 <strong>{topKeyword.count}명</strong>이 “
                    {topKeyword.label}”를 골랐어요
                  </span>
                </Styled.Highlight>
              )}

              {isCompact && (
                <>
                  <ClubInfoList {...infoListProps} />
                  <Styled.Divider />
                </>
              )}

              <ClubDetailBody
                clubId={clubDetail.id}
                description={clubDetail.description}
                insights={insights}
                scheduleSlot={
                  hasSchedule && (
                    <Styled.ScheduleFrame>
                      <ClubScheduleCalendar
                        key={clubId ?? clubName}
                        events={calendarEvents}
                        isLoading={hasCalendarConnection && isCalendarLoading}
                        clubId={clubDetail.id}
                      />
                    </Styled.ScheduleFrame>
                  )
                }
                locationSlot={mapCard}
              />

              {/* 데스크톱은 정보 목록이 없으니 업데이트 시점을 본문 끝에 작게 남긴다 */}
              {!isCompact && updatedLabel && (
                <Styled.UpdatedNote>{updatedLabel}</Styled.UpdatedNote>
              )}
            </Styled.Main>

            {!isCompact && (
              <Styled.Aside>
                <ClubApplyCard
                  status={clubDetail.recruitmentStatus}
                  recruitment={recruitment}
                  countdown={countdown}
                  recruitmentTarget={clubDetail.recruitmentTarget}
                  facts={insights?.facts}
                  onApply={goToApplyGuide}
                />
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
      {/* 지원하기는 바로 지원서로 가지 않고 모집 시간·일정·확인할 점을 정리한 지원 안내 페이지로 보낸다.
          데스크톱은 오른쪽 지원 카드가 버튼을 맡는다 */}
      {isCompact && <ClubApplyButton onBeforeApply={() => navigate('apply')} />}
    </>
  );
};

export default ClubDetailPage;

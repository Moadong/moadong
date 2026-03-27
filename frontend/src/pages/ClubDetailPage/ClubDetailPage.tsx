import { useCallback, useRef } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import Footer from '@/components/common/Footer/Footer';
import Header from '@/components/common/Header/Header';
import UnderlineTabs from '@/components/common/UnderlineTabs/UnderlineTabs';
import NaverMap from '@/components/map/NaverMap';
import { clubLocations } from '@/constants/clubLocation';
import { PAGE_VIEW, USER_EVENT } from '@/constants/eventName';
import useMixpanelTrack from '@/hooks/Mixpanel/useMixpanelTrack';
import useTrackPageView from '@/hooks/Mixpanel/useTrackPageView';
import { useGetClubDetail } from '@/hooks/Queries/useClub';
import { useScrollTo } from '@/hooks/Scroll/useScrollTo';
import useDevice from '@/hooks/useDevice';
import ClubFeed from '@/pages/ClubDetailPage/components/ClubFeed/ClubFeed';
import ClubIntroContent from '@/pages/ClubDetailPage/components/ClubIntroContent/ClubIntroContent';
import ClubProfileCard from '@/pages/ClubDetailPage/components/ClubProfileCard/ClubProfileCard';
import isInAppWebView from '@/utils/isInAppWebView';
import * as Styled from './ClubDetailPage.styles';
import ClubDetailFooter from './components/ClubDetailFooter/ClubDetailFooter';
import ClubDetailTopBar from './components/ClubDetailTopBar/ClubDetailTopBar';

export const TAB_TYPE = {
  INTRO: 'intro',
  PHOTOS: 'photos',
} as const;

type TabType = (typeof TAB_TYPE)[keyof typeof TAB_TYPE];

// 소개내용/활동사진 탭 클릭 시 스크롤이 탑바 하단에 정확히 위치하도록 하는 높이 값
const TOP_BAR_HEIGHT = 50;

const ClubDetailPage = () => {
  const trackEvent = useMixpanelTrack();

  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab') as TabType | null;

  const activeTab: TabType =
    tabParam && Object.values(TAB_TYPE).includes(tabParam)
      ? tabParam
      : TAB_TYPE.INTRO;

  const { clubId, clubName } = useParams<{
    clubId: string;
    clubName: string;
  }>();
  const { isMobile, isTablet } = useDevice();
  const showTopBar = isMobile || isTablet;

  const { data: clubDetail, error } = useGetClubDetail(
    (clubName ?? clubId) || '',
  );

  useTrackPageView(PAGE_VIEW.CLUB_DETAIL_PAGE, clubDetail?.name, !clubDetail);

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
          : USER_EVENT.CLUB_FEED_TAB_CLICKED,
      );
    },
    [setSearchParams, trackEvent],
  );

  const location = clubLocations.find(
    (location) => location.clubName === clubDetail?.name,
  );

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
          clubId={clubId || ''}
          clubName={clubDetail.name}
          tabs={[
            { key: TAB_TYPE.INTRO, label: '소개내용' },
            { key: TAB_TYPE.PHOTOS, label: '활동사진' },
          ]}
          activeTab={activeTab}
          onTabClick={(tabKey) => {
            handleTabClick(tabKey as TabType);
            scrollToContent();
          }}
          initialIsSubscribed={searchParams.get('is_subscribed') === 'true'}
        />
      )}
      <Styled.Container>
        <Styled.ContentWrapper>
          <Styled.LeftSection>
            <ClubProfileCard
              name={clubDetail.name}
              logo={clubDetail.logo}
              cover={clubDetail.cover}
              recruitmentStatus={clubDetail.recruitmentStatus}
              socialLinks={clubDetail.socialLinks}
              introDescription={clubDetail.description.introDescription}
            />
            {location && (
              <Styled.MapWrapper>
                <NaverMap
                  clubName={location.clubName}
                  lat={location.lat}
                  lng={location.lng}
                  building={location.building}
                  detailLocation={location.detailLocation}
                />
              </Styled.MapWrapper>
            )}
          </Styled.LeftSection>

          <Styled.RightSection ref={contentRef}>
            <UnderlineTabs
              tabs={[
                { key: TAB_TYPE.INTRO, label: '소개 내용' },
                { key: TAB_TYPE.PHOTOS, label: '활동사진' },
              ]}
              activeKey={activeTab}
              onTabClick={(tabKey) => handleTabClick(tabKey as TabType)}
              centerOnMobile
            />

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
            </Styled.TabContent>
          </Styled.RightSection>
        </Styled.ContentWrapper>
      </Styled.Container>
      {!isInAppWebView() && <Footer />}
      <ClubDetailFooter
        recruitmentStart={clubDetail.recruitmentStart}
        recruitmentEnd={clubDetail.recruitmentEnd}
        recruitmentStatus={clubDetail.recruitmentStatus}
      />
    </>
  );
};

export default ClubDetailPage;

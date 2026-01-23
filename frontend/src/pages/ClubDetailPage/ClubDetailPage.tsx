import { useCallback, useRef } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import MobileHeader from './components/MobileHeader/MobileHeader';
import Footer from '@/components/common/Footer/Footer';
import Header from '@/components/common/Header/Header';
import { PAGE_VIEW, USER_EVENT } from '@/constants/eventName';
import useMixpanelTrack from '@/hooks/Mixpanel/useMixpanelTrack';
import useTrackPageView from '@/hooks/Mixpanel/useTrackPageView';
import { useGetClubDetail } from '@/hooks/Queries/useClub';
import useDevice from '@/hooks/useDevice';
import { useScrollTo } from '@/hooks/Scroll/useScrollTo';
import ClubFeed from '@/pages/ClubDetailPage/components/ClubFeed/ClubFeed';
import ClubIntroContent from '@/pages/ClubDetailPage/components/ClubIntroContent/ClubIntroContent';
import ClubProfileCard from '@/pages/ClubDetailPage/components/ClubProfileCard/ClubProfileCard';
import * as Styled from './ClubDetailPage.styles';
import ClubDetailFooter from './components/ClubDetailFooter/ClubDetailFooter';

export const TAB_TYPE = {
  INTRO: 'intro',
  PHOTOS: 'photos',
} as const;

type TabType = (typeof TAB_TYPE)[keyof typeof TAB_TYPE];

const ClubDetailPage = () => {
  const trackEvent = useMixpanelTrack();

  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab') as TabType | null;

  const activeTab: TabType =
    tabParam && Object.values(TAB_TYPE).includes(tabParam)
      ? tabParam
      : TAB_TYPE.INTRO;

  const { clubId } = useParams<{ clubId: string }>();
  const { isMobile, isTablet, isLaptop, isDesktop } = useDevice();
  const showMobileHeader = isMobile || isTablet;

  const { data: clubDetail, error } = useGetClubDetail(clubId || '');

  useTrackPageView(PAGE_VIEW.CLUB_DETAIL_PAGE, clubDetail?.name, !clubDetail);

  const contentRef = useRef<HTMLDivElement>(null);
  const HEADER_HEIGHT_OFFSET = 65;
  const { scrollToElement } = useScrollTo();

  const handleTabChange = useCallback(() => {
    scrollToElement(contentRef.current, HEADER_HEIGHT_OFFSET);
  }, [scrollToElement]);

  const handleIntroTabClick = useCallback(() => {
    setSearchParams({ tab: TAB_TYPE.INTRO }, { replace: true });
    trackEvent(USER_EVENT.CLUB_INTRO_TAB_CLICKED);
    handleTabChange();
  }, [setSearchParams, trackEvent, handleTabChange]);

  const handlePhotosTabClick = useCallback(() => {
    setSearchParams({ tab: TAB_TYPE.PHOTOS }, { replace: true });
    trackEvent(USER_EVENT.CLUB_FEED_TAB_CLICKED);
    handleTabChange();
  }, [setSearchParams, trackEvent, handleTabChange]);

  if (error) {
    return <div>에러가 발생했습니다.</div>;
  }

  if (!clubDetail) {
    return null;
  }

  return (
    <>
      {(isLaptop || isDesktop) && <Header />}
      {showMobileHeader && (
        <MobileHeader
          clubId={clubId || ''}
          clubName={clubDetail.name}
          tabs={[
            { key: TAB_TYPE.INTRO, label: '소개내용' },
            { key: TAB_TYPE.PHOTOS, label: '활동사진' },
          ]}
          activeTab={activeTab}
          onTabClick={(tabKey) => {
            if (tabKey === TAB_TYPE.INTRO) {
              handleIntroTabClick();
            } else {
              handlePhotosTabClick();
            }
          }}
        />
      )}
      <Styled.Container>
        <Styled.ContentWrapper>
          <ClubProfileCard
            name={clubDetail.name}
            logo={clubDetail.logo}
            cover={clubDetail.cover}
            recruitmentStatus={clubDetail.recruitmentStatus}
            socialLinks={clubDetail.socialLinks}
            introDescription={clubDetail.description.introDescription}
          />

          <Styled.RightSection ref={contentRef}>
            <Styled.TabList>
              <Styled.TabButton
                $active={activeTab === TAB_TYPE.INTRO}
                onClick={handleIntroTabClick}
              >
                소개 내용
              </Styled.TabButton>
              <Styled.TabButton
                $active={activeTab === TAB_TYPE.PHOTOS}
                onClick={handlePhotosTabClick}
              >
                활동사진
              </Styled.TabButton>
            </Styled.TabList>

            <Styled.TabContent>
              {activeTab === TAB_TYPE.INTRO && (
                <ClubIntroContent {...clubDetail.description} />
              )}
              {activeTab === TAB_TYPE.PHOTOS && (
                <ClubFeed feed={clubDetail.feeds} clubName={clubDetail.name} />
              )}
            </Styled.TabContent>
          </Styled.RightSection>
        </Styled.ContentWrapper>
      </Styled.Container>
      <Footer />
      <ClubDetailFooter
        recruitmentStart={clubDetail.recruitmentStart}
        recruitmentEnd={clubDetail.recruitmentEnd}
        recruitmentStatus={clubDetail.recruitmentStatus}
      />
    </>
  );
};

export default ClubDetailPage;

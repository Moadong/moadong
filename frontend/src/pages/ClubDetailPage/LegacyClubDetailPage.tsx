import { useCallback } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import Footer from '@/components/common/Footer/Footer';
import Header from '@/components/common/Header/Header';
import { PAGE_VIEW, USER_EVENT } from '@/constants/eventName';
import useMixpanelTrack from '@/hooks/Mixpanel/useMixpanelTrack';
import useTrackPageView from '@/hooks/Mixpanel/useTrackPageView';
import { useGetClubDetail } from '@/hooks/Queries/useClub';
import useDevice from '@/hooks/useDevice';
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

const LegacyClubDetailPage = () => {
  const trackEvent = useMixpanelTrack();

  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab') as TabType | null;

  const activeTab: TabType =
    tabParam && Object.values(TAB_TYPE).includes(tabParam)
      ? tabParam
      : TAB_TYPE.INTRO;

  const { clubId } = useParams<{ clubId: string }>();
  const { isMobile, isTablet, isLaptop, isDesktop } = useDevice();

  const { data: clubDetail, error } = useGetClubDetail(clubId || '');

  useTrackPageView(PAGE_VIEW.CLUB_DETAIL_PAGE, clubDetail?.name, !clubDetail);

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

  if (error) {
    return <div>동아리 정보를 불러오는데 실패했습니다.</div>;
  }

  if (!clubDetail) {
    return null;
  }

  return (
    <>
      <Header hideOn={['mobile', 'tablet']} />
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

          <Styled.RightSection>
            <Styled.TabList>
              <Styled.TabButton
                $active={activeTab === TAB_TYPE.INTRO}
                onClick={() => handleTabClick(TAB_TYPE.INTRO)}
              >
                소개 내용
              </Styled.TabButton>
              <Styled.TabButton
                $active={activeTab === TAB_TYPE.PHOTOS}
                onClick={() => handleTabClick(TAB_TYPE.PHOTOS)}
              >
                활동사진
              </Styled.TabButton>
            </Styled.TabList>

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
      <Footer />
      <ClubDetailFooter
        recruitmentStart={clubDetail.recruitmentStart}
        recruitmentEnd={clubDetail.recruitmentEnd}
        recruitmentStatus={clubDetail.recruitmentStatus}
        hideShareButtonOnMobile
      />
    </>
  );
};

export default LegacyClubDetailPage;

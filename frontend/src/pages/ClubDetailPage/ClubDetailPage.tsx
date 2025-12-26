import { useState } from 'react';
import { useParams } from 'react-router-dom';
import Footer from '@/components/common/Footer/Footer';
import Header from '@/components/common/Header/Header';
import { PAGE_VIEW, USER_EVENT } from '@/constants/eventName';
import { useGetClubDetail } from '@/hooks/queries/club/useGetClubDetail';
import useDevice from '@/hooks/useDevice';
import useMixpanelTrack from '@/hooks/useMixpanelTrack';
import useTrackPageView from '@/hooks/useTrackPageView';
import ClubFeed from '@/pages/ClubDetailPage/components/ClubFeed/ClubFeed';
import ClubIntroContent from '@/pages/ClubDetailPage/components/ClubIntroContent/ClubIntroContent';
import ClubProfileCard from '@/pages/ClubDetailPage/components/ClubProfileCard/ClubProfileCard';
import * as Styled from './ClubDetailPage.styles';

const ClubDetailPage = () => {
  const [activeTab, setActiveTab] = useState<'intro' | 'photos'>('intro');

  const { clubId } = useParams<{ clubId: string }>();
  const { isLaptop, isDesktop } = useDevice();
  const trackEvent = useMixpanelTrack();

  const { data: clubDetail, error } = useGetClubDetail(clubId || '');

  useTrackPageView(PAGE_VIEW.CLUB_DETAIL_PAGE, clubDetail?.name, !clubDetail);

  if (!clubDetail) {
    return null;
  }

  if (error) {
    return <div>에러가 발생했습니다.</div>;
  }

  return (
    <>
      {(isLaptop || isDesktop) && <Header />}
      <Styled.Container>
        <Styled.ContentWrapper>
          <ClubProfileCard
            name={clubDetail.name}
            logo={clubDetail.logo}
            cover={clubDetail.cover}
            recruitmentStatus={clubDetail.recruitmentStatus}
            socialLinks={clubDetail.socialLinks}
            activityDescription={clubDetail.description.activityDescription}
          />

          <Styled.RightSection>
            <Styled.TabList>
              <Styled.TabButton
                $active={activeTab === 'intro'}
                onClick={() => {
                  setActiveTab('intro');
                  trackEvent(USER_EVENT.CLUB_INTRO_TAB_CLICKED);
                }}
              >
                소개 내용
              </Styled.TabButton>
              <Styled.TabButton
                $active={activeTab === 'photos'}
                onClick={() => {
                  setActiveTab('photos');
                  trackEvent(USER_EVENT.CLUB_FEED_TAB_CLICKED);
                }}
              >
                활동사진
              </Styled.TabButton>
            </Styled.TabList>

            <Styled.TabContent>
              {activeTab === 'intro' && (
                <ClubIntroContent {...clubDetail.description} />
              )}
              {activeTab === 'photos' && (
                <ClubFeed feed={clubDetail.feeds} clubName={clubDetail.name} />
              )}
            </Styled.TabContent>
          </Styled.RightSection>
        </Styled.ContentWrapper>
      </Styled.Container>
      <Footer />
    </>
  );
};

export default ClubDetailPage;

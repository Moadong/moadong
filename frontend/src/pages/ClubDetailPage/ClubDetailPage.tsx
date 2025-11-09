import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import * as Styled from '@/styles/PageContainer.styles';
import Header from '@/components/common/Header/Header';
import BackNavigationBar from '@/pages/ClubDetailPage/components/BackNavigationBar/BackNavigationBar';
import ClubDetailHeader from '@/pages/ClubDetailPage/components/ClubDetailHeader/ClubDetailHeader';
import InfoTabs from '@/pages/ClubDetailPage/components/InfoTabs/InfoTabs';
import InfoBox from '@/pages/ClubDetailPage/components/InfoBox/InfoBox';
import IntroduceBox from '@/pages/ClubDetailPage/components/IntroduceBox/IntroduceBox';
import PhotoList from '@/pages/ClubDetailPage/components/PhotoList/PhotoList';
import Footer from '@/components/common/Footer/Footer';
import ClubDetailFooter from '@/pages/ClubDetailPage/components/ClubDetailFooter/ClubDetailFooter';
import useTrackPageView from '@/hooks/useTrackPageView';
import useAutoScroll from '@/hooks/InfoTabs/useAutoScroll';
import { useGetClubDetail } from '@/hooks/queries/club/useGetClubDetail';
import RecommendedClubs from '@/pages/ClubDetailPage/components/RecommendedClubs/RecommendedClubs';

const ClubDetailPage = () => {
  const { clubId } = useParams<{ clubId: string }>();
  const { sectionRefs, scrollToSection } = useAutoScroll();
  const [showHeader, setShowHeader] = useState(window.innerWidth > 500);

  const { data: clubDetail, error } = useGetClubDetail(clubId || '');

  useEffect(() => {
    const handleResize = () => {
      setShowHeader(window.innerWidth > 500);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useTrackPageView(`ClubDetailPage`, clubDetail?.name);

  if (!clubDetail) {
    return null;
  }

  if (error) {
    return <div>에러가 발생했습니다.</div>;
  }

  return (
    <>
      {showHeader && <Header />}
      <BackNavigationBar />
      <Styled.PageContainer>
        <ClubDetailHeader
          name={clubDetail.name}
          category={clubDetail.category}
          division={clubDetail.division}
          tags={clubDetail.tags}
          logo={clubDetail.logo}
          recruitmentPeriod={clubDetail.recruitmentPeriod}
          recruitmentForm={clubDetail.recruitmentForm}
          presidentPhoneNumber={clubDetail.presidentPhoneNumber}
        />
        <InfoTabs onTabClick={scrollToSection} />
        <InfoBox sectionRefs={sectionRefs} clubDetail={clubDetail} />
        <IntroduceBox
          sectionRefs={sectionRefs}
          description={clubDetail.description}
        />
        <PhotoList
          sectionRefs={sectionRefs}
          feeds={clubDetail.feeds}
          clubName={clubDetail.name}
        />
        {/* <RecommendedClubs clubs={clubDetail.recommendClubs ?? []} /> */}
      </Styled.PageContainer>
      <Footer />
      <ClubDetailFooter
        recruitmentPeriod={clubDetail.recruitmentPeriod}
        recruitmentForm={clubDetail.recruitmentForm}
      />
    </>
  );
};

export default ClubDetailPage;

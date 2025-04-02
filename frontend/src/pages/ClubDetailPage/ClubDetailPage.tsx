import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
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
import useAutoScroll from '@/hooks/useAutoScroll';
import { useGetClubDetail } from '@/hooks/queries/club/useGetClubDetail';

const ClubDetailPage = () => {
  const { sectionRefs, scrollToSection } = useAutoScroll();
  const [showHeader, setShowHeader] = useState(window.innerWidth > 500);

  const location = useLocation();
  const clubId = (location.state as { clubId?: string })?.clubId;
  const { data: clubDetail, error } = useGetClubDetail(clubId || '');

  useEffect(() => {
    const handleResize = () => {
      setShowHeader(window.innerWidth > 500);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useTrackPageView(`ClubDetailPage ${clubDetail?.name || ''}`);

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
        />
        <InfoTabs onTabClick={scrollToSection} />
        <InfoBox sectionRefs={sectionRefs} clubDetail={clubDetail} />
        <IntroduceBox
          sectionRefs={sectionRefs}
          description={clubDetail.description}
        />
        <PhotoList sectionRefs={sectionRefs} feeds={clubDetail.feeds} />
      </Styled.PageContainer>
      <Footer />
      <ClubDetailFooter />
    </>
  );
};

export default ClubDetailPage;

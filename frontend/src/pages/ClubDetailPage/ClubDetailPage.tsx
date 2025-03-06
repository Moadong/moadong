import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '@/components/common/Header/Header';
import BackNavigationBar from '@/pages/ClubDetailPage/components/BackNavigationBar/BackNavigationBar';
import ClubDetailHeader from '@/pages/ClubDetailPage/components/ClubDetailHeader/ClubDetailHeader';
import InfoTabs from '@/pages/ClubDetailPage/components/InfoTabs/InfoTabs';
import InfoBox from '@/pages/ClubDetailPage/components/InfoBox/InfoBox';
import IntroduceBox from '@/pages/ClubDetailPage/components/IntroduceBox/IntroduceBox';
import Footer from '@/components/common/Footer/Footer';
import ClubDetailFooter from '@/pages/ClubDetailPage/components/ClubDetailFooter/ClubDetailFooter';
import * as Styled from '@/styles/PageContainer.styles';
import useAutoScroll from '@/hooks/useAutoScroll';
import { useGetClubDetail } from '@/hooks/queries/club/useGetClubDetail';

const ClubDetailPage = () => {
  const { clubId } = useParams<{ clubId: string }>();
  const { sectionRefs, scrollToSection } = useAutoScroll();
  const [showHeader, setShowHeader] = useState(window.innerWidth > 500);

  const { data: clubDetail, isLoading, error } = useGetClubDetail(clubId || '');

  useEffect(() => {
    const handleResize = () => {
      setShowHeader(window.innerWidth > 500);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // [x]TODO: 로딩화면 구현해야 함

  if (!clubDetail) {
    return <div>Loading...</div>;
  }

  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      {showHeader && <Header />}
      <BackNavigationBar />
      <Styled.PageContainer>
        <ClubDetailHeader
          name={clubDetail.name}
          classification={clubDetail.classification}
          division={clubDetail.division}
          tags={clubDetail.tags}
        />
        <InfoTabs onTabClick={scrollToSection} />
        <InfoBox sectionRefs={sectionRefs} clubDetail={clubDetail} />
        <IntroduceBox
          sectionRefs={sectionRefs}
          description={clubDetail.description}
        />
      </Styled.PageContainer>
      <Footer />
      <ClubDetailFooter />
    </>
  );
};

export default ClubDetailPage;

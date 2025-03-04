import React, { useEffect, useState } from 'react';
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
import { getClubDetail } from '@/apis/getClubDetail';
import { ClubDetail } from '@/types/club';

const ClubDetailPage = () => {
  const { sectionRefs, scrollToSection } = useAutoScroll();
  const [showHeader, setShowHeader] = useState(window.innerWidth > 500);
  const [clubDetail, setClubDetail] = useState<ClubDetail | null>(null);

  useEffect(() => {
    const handleResize = () => {
      setShowHeader(window.innerWidth > 500);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getClubDetail('67c4145f64203e4259638b27');
        setClubDetail(data);
      } catch (error) {
        console.error('Error fetching club details:', error);
      }
    };
    fetchData();
  }, []);

  if (!clubDetail) {
    return <div>Loading...</div>; // ✅ clubDetail이 null이면 로딩 표시
  }

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
        <IntroduceBox sectionRefs={sectionRefs} />
      </Styled.PageContainer>
      <Footer />
      <ClubDetailFooter />
    </>
  );
};

export default ClubDetailPage;

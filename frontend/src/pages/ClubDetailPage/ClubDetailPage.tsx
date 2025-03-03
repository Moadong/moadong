import React, { useEffect } from 'react';
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

const ClubDetailPage = () => {
  const { sectionRefs, scrollToSection } = useAutoScroll();
  const [showHeader, setShowHeader] = React.useState(window.innerWidth > 500);

  useEffect(() => {
    const handleResize = () => {
      setShowHeader(window.innerWidth > 500);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      {showHeader && <Header />}
      <BackNavigationBar />
      <Styled.PageContainer>
        <ClubDetailHeader />
        <InfoTabs onTabClick={scrollToSection} />
        <InfoBox sectionRefs={sectionRefs} />
        <IntroduceBox sectionRefs={sectionRefs} />
      </Styled.PageContainer>
      <Footer />
      <ClubDetailFooter />
    </>
  );
};
export default ClubDetailPage;

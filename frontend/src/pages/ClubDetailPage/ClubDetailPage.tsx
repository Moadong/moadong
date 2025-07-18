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

const notJoinedClubNames = [
  'PKNUO',
  'UCDC',
  '울림',
  '쇳물결',
  '한누리',
  '씨사운드',
  '백경클래식기타연구회',
  '남천로타렉트',
  '동반',
  '민심사랑',
  '절영회',
  '청심회',
  '피어드림',
  '버드',
  '모비딕',
  '후라',
  '어택',
  '홍백',
  '바구니',
  '산악부',
  '한판',
  '리얼겟',
  '조정부',
  '조나단',
  '불교학생회',
  'JDM',
  'SFC',
  '가톨릭학생회',
  'CCC',
  'PAS',
  '300',
  '백경 유스호스텔',
  '짚신 유스호스텔',
  '수석회',
  '포시즌',
  'O.S.T',
  'SIC',
  'CERT-IS',
  'testaa',
];

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
      </Styled.PageContainer>
      <Footer />
      <ClubDetailFooter
        recruitmentPeriod={clubDetail.recruitmentPeriod}
        recruitmentForm={clubDetail.recruitmentForm}
        presidentPhoneNumber={clubDetail.presidentPhoneNumber}
      />
    </>
  );
};

export default ClubDetailPage;

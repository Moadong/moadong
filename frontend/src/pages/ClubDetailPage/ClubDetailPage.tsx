import { useParams } from 'react-router-dom';
import Footer from '@/components/common/Footer/Footer';
import Header from '@/components/common/Header/Header';
import { PAGE_VIEW } from '@/constants/eventName';
import useAutoScroll from '@/hooks/InfoTabs/useAutoScroll';
import { useGetClubDetail } from '@/hooks/queries/club/useGetClubDetail';
import useDevice from '@/hooks/useDevice';
import useTrackPageView from '@/hooks/useTrackPageView';
import BackNavigationBar from '@/pages/ClubDetailPage/components/BackNavigationBar/BackNavigationBar';
import ClubDetailContent from '@/pages/ClubDetailPage/components/ClubDetailContent/ClubDetailContent';
import ClubDetailFooter from '@/pages/ClubDetailPage/components/ClubDetailFooter/ClubDetailFooter';
import ClubDetailHeader from '@/pages/ClubDetailPage/components/ClubDetailHeader/ClubDetailHeader';
import InfoBox from '@/pages/ClubDetailPage/components/InfoBox/InfoBox';
import InfoTabs from '@/pages/ClubDetailPage/components/InfoTabs/InfoTabs';
import IntroduceBox from '@/pages/ClubDetailPage/components/IntroduceBox/IntroduceBox';
import PhotoList from '@/pages/ClubDetailPage/components/PhotoList/PhotoList';
import * as Styled from '@/styles/PageContainer.styles';
import isInAppWebView from '@/utils/isInAppWebView';

const ClubDetailPage = () => {
  const { clubId } = useParams<{ clubId: string }>();
  const { sectionRefs, scrollToSection } = useAutoScroll();
  const { isMobile } = useDevice();

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
      {!isMobile && <Header />}
      {!isInAppWebView() && <BackNavigationBar />}
      <Styled.PageContainer>
        <ClubDetailHeader
          name={clubDetail.name}
          category={clubDetail.category}
          division={clubDetail.division}
          tags={clubDetail.tags}
          logo={clubDetail.logo}
          presidentPhoneNumber={clubDetail.presidentPhoneNumber}
        />
        {/* <InfoTabs onTabClick={scrollToSection} />
        <InfoBox sectionRefs={sectionRefs} clubDetail={clubDetail} />
        <IntroduceBox
          sectionRefs={sectionRefs}
          description={clubDetail.description}
        />
        <PhotoList
          sectionRefs={sectionRefs}
          feeds={clubDetail.feeds}
          clubName={clubDetail.name}
        /> */}
        <ClubDetailContent
          activityDescription='분야, 주제, 개발환경 등을 자율적으로 선택하여 한 학기 동안 팀원들과 프로젝트를 진행하고, 결과물을 제작해 발표 및 전시하는 활동을 합니다.'
          awards={[
            {
              semester: '2025 1학기',
              achievements: [
                '교내 프로그래밍 경진대회 대상, 최우수상, 장려상 배출',
                '2024 라이프 스타일 스마트 가전 메이커톤 대상',
                '1학기 우수 프로젝트 K-ICT week in BUSAN 2025 출품',
                '네부캠 10기 합격자 배출',
              ],
            },
            {
              semester: '2024 2학기',
              achievements: [
                '학술 분과 우수 동아리 선정',
                '제 1회 백경 해커톤 대회 우수상',
                '모배디 해커톤 경진대회 대상',
                '교내 프로그래밍 경진대회 대상, 최우수상, 우수상, 장려상 배출',
                '우아한 테크코스, SSAFY, 네부캠 합격자 배출',
                '지역문제 해결 연합 해커톤 경진대회 개최',
              ],
            },
          ]}
          idealCandidate={{
            content:
              '이런 사람이 오면 좋아요, 열정적이고 협업을 중시하는 분들을 환영합니다. (실제 DB 데이터로 대체됨)',
          }}
          benefits={`협업하며 프로젝트를 진행하고, 직접 결과물을 만들어 개발 경험을 쌓을 수 있습니다.\n프로젝트 결과물을 동아리 부원 및 외부인에게 발표하고 시연할 수 있습니다.\n졸업한 현업자 선배님들의 이야기를 생생히 들을 수 있는 홈커밍데이에 참여할 수 있습니다.`}
          faqs={[
            {
              question: '동아리에 가입하고 싶어요.',
              answer: '동아리에 가입하고 싶어요.',
            },
            {
              question: '동아리에 가입하고 싶어요.',
              answer: '동아리에 가입하고 싶어요.',
            },
            {
              question: '동아리에 가입하고 싶어요.',
              answer: '동아리에 가입하고 싶어요.',
            },
          ]}
        />
      </Styled.PageContainer>
      <Footer />
      <ClubDetailFooter
        recruitmentStart={clubDetail.recruitmentStart}
        recruitmentEnd={clubDetail.recruitmentEnd}
      />
    </>
  );
};

export default ClubDetailPage;

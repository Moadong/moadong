import Footer from '@/components/common/Footer/Footer';
import Header from '@/components/common/Header/Header';
import { CLUB_UNION_MEMBERS } from '@/constants/clubUnionInfo';
import { PAGE_VIEW } from '@/constants/eventName';
import useTrackPageView from '@/hooks/Mixpanel/useTrackPageView';
import { PageContainer } from '@/styles/PageContainer.styles';
import * as Styled from './ClubUnionPage.styles';

const ClubUnionPage = () => {
  useTrackPageView(PAGE_VIEW.CLUB_UNION_PAGE);

  return (
    <>
      <Header hideOn={['webview']} />
      <PageContainer>
        <Styled.Title>총동아리연합회 소개</Styled.Title>
        <Styled.IntroductionText>
          안녕하세요! 부경대학교 제16대 총동아리연합회 '온'입니다.
          <br />온 동아리를 위하여, 온 힘을 다해.
        </Styled.IntroductionText>
        <Styled.ProfileGrid>
          {CLUB_UNION_MEMBERS.map((member) => (
            <Styled.ProfileCardContainer key={member.id}>
              <Styled.ProfileImage
                src={member.imageSrc}
                alt={`${member.name} 프로필`}
              />

              {/* 평소에 보이는 이름 배지 */}
              <Styled.NameBadge>{member.name}</Styled.NameBadge>

              {/* 호버 시 나타나는 정보 */}
              <Styled.InfoOverlay>
                <Styled.Role>{member.role}</Styled.Role>
                <Styled.Name>{member.name}</Styled.Name>
                <Styled.Description>{member.description}</Styled.Description>
              </Styled.InfoOverlay>
            </Styled.ProfileCardContainer>
          ))}
        </Styled.ProfileGrid>
      </PageContainer>
      <Footer />
    </>
  );
};

export default ClubUnionPage;

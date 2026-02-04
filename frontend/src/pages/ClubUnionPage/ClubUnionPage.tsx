import InstagramIcon from '@/assets/images/icons/sns/instagram_icon.svg';
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
          안녕하세요! 부경대학교 제17대 총동아리연합회 'we:sh'입니다.
          <br />As we wish, 우리가 바라는 대로.
        </Styled.IntroductionText>
        <Styled.SnsLinkContainer>
          <Styled.SnsLink
            href="https://www.instagram.com/17th_wesh"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={InstagramIcon} alt="인스타그램" />
            Instagram
          </Styled.SnsLink>
          <Styled.SnsLink
            href="https://pf.kakao.com/_WBqUxb"
            target="_blank"
            rel="noopener noreferrer"
          >
            💬 카카오톡
          </Styled.SnsLink>
        </Styled.SnsLinkContainer>
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

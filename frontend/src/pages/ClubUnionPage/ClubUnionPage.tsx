import InstagramIcon from '@/assets/images/icons/sns/instagram_icon.svg';
import Footer from '@/components/common/Footer/Footer';
import Header from '@/components/common/Header/Header';
import { CLUB_UNION_MEMBERS, CLUB_UNION_SNS } from '@/constants/clubUnionInfo';
import { PAGE_VIEW, USER_EVENT } from '@/constants/eventName';
import useMixpanelTrack from '@/hooks/Mixpanel/useMixpanelTrack';
import useTrackPageView from '@/hooks/Mixpanel/useTrackPageView';
import { PageContainer } from '@/styles/PageContainer.styles';
import { colors } from '@/styles/theme/colors';
import * as Styled from './ClubUnionPage.styles';

const MEMBER_COLORS = {
  PRESIDENT: colors.accent[1][500],
  VICE_PRESIDENT: colors.accent[1][500],
  PLANNING: colors.accent[1][500],
  SECRETARY: colors.accent[1][500],
  PROMOTION: colors.accent[1][500],
  VOLUNTEER: colors.secondary[1].back,
  RELIGION: colors.secondary[2].back,
  HOBBY: colors.secondary[3].back,
  STUDY: colors.secondary[4].back,
  SPORT: colors.secondary[5].back,
  PERFORMANCE: colors.secondary[6].back,
};

const ClubUnionPage = () => {
  useTrackPageView(PAGE_VIEW.CLUB_UNION_PAGE);
  const trackEvent = useMixpanelTrack();

  return (
    <>
      <Header hideOn={['webview']} />
      <PageContainer>
        <Styled.Title>총동아리연합회 소개</Styled.Title>
        <Styled.IntroductionText>
          안녕하세요! 부경대학교 제17대 총동아리연합회 'we:sh'입니다.
          <br />
          As we wish, 우리가 바라는 대로.
        </Styled.IntroductionText>
        <Styled.SnsLinkContainer>
          <Styled.SnsLink
            href={CLUB_UNION_SNS.instagram}
            target='_blank'
            rel='noopener noreferrer'
            onClick={() =>
              trackEvent(USER_EVENT.CLUB_UNION_SNS_CLICKED, {
                platform: 'instagram',
              })
            }
          >
            <img src={InstagramIcon} alt='인스타그램' />
            Instagram
          </Styled.SnsLink>
          <Styled.SnsLink
            href={CLUB_UNION_SNS.kakaotalk}
            target='_blank'
            rel='noopener noreferrer'
            onClick={() =>
              trackEvent(USER_EVENT.CLUB_UNION_SNS_CLICKED, {
                platform: 'kakaotalk',
              })
            }
          >
            💬 카카오톡
          </Styled.SnsLink>
        </Styled.SnsLinkContainer>
        <Styled.ProfileGrid>
          {CLUB_UNION_MEMBERS.map((member) => (
            <Styled.ProfileCardContainer
              key={member.id}
              bgColor={MEMBER_COLORS[member.type]}
            >
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

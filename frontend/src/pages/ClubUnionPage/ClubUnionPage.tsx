import InstagramIcon from '@/assets/images/icons/sns/instagram_icon.svg';
import Footer from '@/components/common/Footer/Footer';
import Header from '@/components/common/Header/Header';
import { CLUB_UNION_MEMBERS, CLUB_UNION_SNS } from '@/constants/clubUnionInfo';
import { PAGE_VIEW, USER_EVENT } from '@/constants/eventName';
import useMixpanelTrack from '@/hooks/Mixpanel/useMixpanelTrack';
import useTrackPageView from '@/hooks/Mixpanel/useTrackPageView';
import { PageContainer } from '@/styles/PageContainer.styles';
import * as Styled from './ClubUnionPage.styles';

const COLUMN_COUNT = 4;

const ClubUnionPage = () => {
  useTrackPageView(PAGE_VIEW.CLUB_UNION_PAGE);
  const trackEvent = useMixpanelTrack();

  const columns = Array.from({ length: COLUMN_COUNT }, (_, colIdx) =>
    CLUB_UNION_MEMBERS.filter(
      (_, memberIdx) => memberIdx % COLUMN_COUNT === colIdx,
    ),
  );

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
            instagram
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
            💬 kakaotalk
          </Styled.SnsLink>
        </Styled.SnsLinkContainer>
        <Styled.ProfileGrid>
          {columns.map((columnMembers, colIdx) => (
            <Styled.ProfileColumn key={colIdx} $staggered={colIdx % 2 === 1}>
              {columnMembers.map((member) => (
                <Styled.ProfileCard key={member.id} $bgColor={member.bgColor}>
                  <Styled.CardContent>
                    <Styled.CardTitleRow>
                      <Styled.CardName>{member.name}</Styled.CardName>
                      <Styled.CardRoleBadge>{member.role}</Styled.CardRoleBadge>
                    </Styled.CardTitleRow>
                    <Styled.CardDescription>
                      {member.description}
                    </Styled.CardDescription>
                  </Styled.CardContent>
                  <Styled.CardIllustrationWrap>
                    <Styled.CardIllustration
                      src={member.imageSrc}
                      alt={`${member.name} 아이콘`}
                    />
                  </Styled.CardIllustrationWrap>
                </Styled.ProfileCard>
              ))}
            </Styled.ProfileColumn>
          ))}
        </Styled.ProfileGrid>
      </PageContainer>
      <Footer />
    </>
  );
};

export default ClubUnionPage;

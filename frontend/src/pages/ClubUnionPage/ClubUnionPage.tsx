import { useEffect, useState } from 'react';
import InstagramIcon from '@/assets/images/icons/insta.svg';
import KakaoIcon from '@/assets/images/icons/kakao.svg';
import Footer from '@/components/common/Footer/Footer';
import Header from '@/components/common/Header/Header';
import {
  CLUB_UNION_MEMBERS,
  CLUB_UNION_MEMBERS_MOBILE,
  CLUB_UNION_SNS,
  type ClubUnionMember,
} from '@/constants/clubUnionInfo';
import { PAGE_VIEW, USER_EVENT } from '@/constants/eventName';
import useMixpanelTrack from '@/hooks/Mixpanel/useMixpanelTrack';
import useTrackPageView from '@/hooks/Mixpanel/useTrackPageView';
import { PageContainer } from '@/styles/PageContainer.styles';
import * as Styled from './ClubUnionPage.styles';

const COLUMN_SIZES = [3, 3, 4, 3];
const MOBILE_BREAKPOINT = '(max-width: 500px)';

const { cols, offset } = COLUMN_SIZES.reduce<{
  cols: (typeof CLUB_UNION_MEMBERS)[];
  offset: number;
}>(
  ({ cols, offset }, size) => ({
    cols: [...cols, CLUB_UNION_MEMBERS.slice(offset, offset + size)],
    offset: offset + size,
  }),
  { cols: [], offset: 0 },
);

const COLUMNS =
  offset < CLUB_UNION_MEMBERS.length
    ? [...cols, CLUB_UNION_MEMBERS.slice(offset)]
    : cols;

const ProfileCard = ({ member }: { member: ClubUnionMember }) => (
  <Styled.ProfileCard $bgColor={member.bgColor}>
    <Styled.CardContent>
      <Styled.CardTitleRow>
        <Styled.CardName>{member.name}</Styled.CardName>
        <Styled.CardRoleBadge>{member.role}</Styled.CardRoleBadge>
      </Styled.CardTitleRow>
      <Styled.CardDescription>{member.description}</Styled.CardDescription>
    </Styled.CardContent>
    <Styled.CardIllustrationWrap>
      <Styled.CardIllustration
        src={member.imageSrc}
        alt={`${member.name} 아이콘`}
      />
    </Styled.CardIllustrationWrap>
  </Styled.ProfileCard>
);

const ClubUnionPage = () => {
  useTrackPageView(PAGE_VIEW.CLUB_UNION_PAGE);
  const trackEvent = useMixpanelTrack();
  const [isMobile, setIsMobile] = useState(
    () =>
      typeof window.matchMedia === 'function' &&
      window.matchMedia(MOBILE_BREAKPOINT).matches,
  );

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return;
    const mq = window.matchMedia(MOBILE_BREAKPOINT);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return (
    <>
      <Header />
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
            <img src={KakaoIcon} alt='카카오톡' />
            kakaotalk
          </Styled.SnsLink>
        </Styled.SnsLinkContainer>
        <Styled.ProfileGrid>
          {isMobile ? (
            <Styled.ProfileColumn $staggered={false}>
              {CLUB_UNION_MEMBERS_MOBILE.map((member) => (
                <ProfileCard key={member.id} member={member} />
              ))}
            </Styled.ProfileColumn>
          ) : (
            COLUMNS.map((columnMembers, colIdx) => (
              <Styled.ProfileColumn key={colIdx} $staggered={colIdx % 2 === 1}>
                {columnMembers.map((member) => (
                  <ProfileCard key={member.id} member={member} />
                ))}
              </Styled.ProfileColumn>
            ))
          )}
        </Styled.ProfileGrid>
      </PageContainer>
      <Footer />
    </>
  );
};

export default ClubUnionPage;

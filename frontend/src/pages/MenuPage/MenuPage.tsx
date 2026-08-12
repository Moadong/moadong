import { useNavigate } from 'react-router-dom';
import ChevronIcon from '@/assets/images/icons/menu/chevron.svg?react';
import mailboxIllustration from '@/assets/images/menu/mailbox_illustration.png';
import { PAGE_VIEW, USER_EVENT } from '@/constants/eventName';
import useHeaderNavigation from '@/hooks/Header/useHeaderNavigation';
import useMixpanelTrack from '@/hooks/Mixpanel/useMixpanelTrack';
import useTrackPageView from '@/hooks/Mixpanel/useTrackPageView';
import getAppVersion from '@/utils/getAppVersion';
import * as Styled from './MenuPage.styles';

const PRIVACY_POLICY_URL =
  'https://honorable-cough-8f9.notion.site/232aad23209680f2a2cadb146eff81cd?pvs=74';

const MenuPage = () => {
  useTrackPageView(PAGE_VIEW.MENU_PAGE);
  const { handleIntroduceClick, handleClubUnionClick } = useHeaderNavigation();
  const trackEvent = useMixpanelTrack();
  const navigate = useNavigate();
  const appVersion = getAppVersion();

  const handleFeedbackClick = () => {
    trackEvent(USER_EVENT.FEEDBACK_ENTRY_CLICKED);
    navigate('/feedback');
  };

  return (
    <Styled.Container>
      <Styled.Title>메뉴</Styled.Title>

      <Styled.CardGrid>
        <Styled.MailboxCard type='button' onClick={handleFeedbackClick}>
          <Styled.CardHeader>
            <Styled.CardTitle>모아동 우체통</Styled.CardTitle>
            <Styled.CardChevron>
              <ChevronIcon width={22} height={22} aria-hidden />
            </Styled.CardChevron>
          </Styled.CardHeader>
          <Styled.CardDescription>
            {'소식을 확인하고 의견을\n보내보세요'}
          </Styled.CardDescription>
          <Styled.MailboxIllustration src={mailboxIllustration} alt='' />
        </Styled.MailboxCard>

        <Styled.Card type='button' onClick={handleIntroduceClick}>
          <Styled.CardHeader>
            <Styled.CardTitle>서비스 소개</Styled.CardTitle>
            <Styled.CardChevron>
              <ChevronIcon width={22} height={22} aria-hidden />
            </Styled.CardChevron>
          </Styled.CardHeader>
          <Styled.CardDescription>
            {'모아동 서비스가\n궁금하다면'}
          </Styled.CardDescription>
        </Styled.Card>

        <Styled.Card type='button' onClick={handleClubUnionClick}>
          <Styled.CardHeader>
            <Styled.CardTitle>총 동아리 연합회</Styled.CardTitle>
            <Styled.CardChevron>
              <ChevronIcon width={22} height={22} aria-hidden />
            </Styled.CardChevron>
          </Styled.CardHeader>
          <Styled.CardDescription>
            {"제 16대 총동아리\n연합회 '온'"}
          </Styled.CardDescription>
        </Styled.Card>
      </Styled.CardGrid>

      <Styled.InfoSection>
        <Styled.InfoLink
          href={PRIVACY_POLICY_URL}
          target='_blank'
          rel='noopener noreferrer'
        >
          개인 정보 처리방침
          <Styled.CardChevron>
            <ChevronIcon width={22} height={22} aria-hidden />
          </Styled.CardChevron>
        </Styled.InfoLink>

        {appVersion && (
          <>
            <Styled.Divider />
            <Styled.InfoRow>
              앱 버전
              <Styled.VersionText>{appVersion}</Styled.VersionText>
            </Styled.InfoRow>
          </>
        )}

        <Styled.AdminButton
          type='button'
          onClick={() => navigate('/admin/login')}
        >
          관리자 페이지
          <Styled.AdminChevron>
            <ChevronIcon width={22} height={22} aria-hidden />
          </Styled.AdminChevron>
        </Styled.AdminButton>
      </Styled.InfoSection>
    </Styled.Container>
  );
};

export default MenuPage;

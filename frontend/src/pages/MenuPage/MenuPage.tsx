import ChevronIcon from '@/assets/images/icons/menu/chevron.svg?react';
import DocumentIcon from '@/assets/images/icons/menu/document.svg?react';
import InfoIcon from '@/assets/images/icons/menu/info.svg?react';
import PeopleIcon from '@/assets/images/icons/menu/people.svg?react';
import MoadongIcon from '@/assets/images/logos/moadong_mobile_logo.svg?react';
import { PAGE_VIEW } from '@/constants/eventName';
import useHeaderNavigation from '@/hooks/Header/useHeaderNavigation';
import useTrackPageView from '@/hooks/Mixpanel/useTrackPageView';
import getAppVersion from '@/utils/getAppVersion';
import * as Styled from './MenuPage.styles';

const PRIVACY_POLICY_URL =
  'https://honorable-cough-8f9.notion.site/232aad23209680f2a2cadb146eff81cd?pvs=74';

const MenuPage = () => {
  useTrackPageView(PAGE_VIEW.MENU_PAGE);
  const { handleIntroduceClick, handleClubUnionClick } = useHeaderNavigation();
  const appVersion = getAppVersion();

  return (
    <Styled.Container>
      <Styled.Title>더보기</Styled.Title>
      <Styled.MenuList>
        <Styled.MenuItem type='button' onClick={handleIntroduceClick}>
          <Styled.ItemLeft>
            <Styled.IconCircle>
              <InfoIcon width={24} height={24} aria-hidden />
            </Styled.IconCircle>
            <Styled.ItemText>서비스 소개</Styled.ItemText>
          </Styled.ItemLeft>
          <Styled.Chevron>
            <ChevronIcon width={20} height={20} aria-hidden />
          </Styled.Chevron>
        </Styled.MenuItem>

        <Styled.MenuItem type='button' onClick={handleClubUnionClick}>
          <Styled.ItemLeft>
            <Styled.IconCircle>
              <PeopleIcon width={24} height={24} aria-hidden />
            </Styled.IconCircle>
            <Styled.ItemText>총 동아리 연합회</Styled.ItemText>
          </Styled.ItemLeft>
          <Styled.Chevron>
            <ChevronIcon width={20} height={20} aria-hidden />
          </Styled.Chevron>
        </Styled.MenuItem>

        <Styled.MenuLink
          href={PRIVACY_POLICY_URL}
          target='_blank'
          rel='noopener noreferrer'
        >
          <Styled.ItemLeft>
            <Styled.IconCircle>
              <DocumentIcon width={24} height={24} aria-hidden />
            </Styled.IconCircle>
            <Styled.ItemText>개인정보 처리방침</Styled.ItemText>
          </Styled.ItemLeft>
          <Styled.Chevron>
            <ChevronIcon width={20} height={20} aria-hidden />
          </Styled.Chevron>
        </Styled.MenuLink>

        {appVersion && (
          <Styled.MenuInfoRow>
            <Styled.ItemLeft>
              <Styled.IconCircle>
                <MoadongIcon width={24} height={24} aria-hidden />
              </Styled.IconCircle>
              <Styled.ItemText>앱 버전</Styled.ItemText>
            </Styled.ItemLeft>
            <Styled.VersionText>{appVersion}</Styled.VersionText>
          </Styled.MenuInfoRow>
        )}
      </Styled.MenuList>
    </Styled.Container>
  );
};

export default MenuPage;

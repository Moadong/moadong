import { PAGE_VIEW, USER_EVENT } from '@/constants/eventName';
import useMixpanelTrack from '@/hooks/Mixpanel/useMixpanelTrack';
import useTrackPageView from '@/hooks/Mixpanel/useTrackPageView';
import useAppVersion from '@/hooks/useAppVersion';
import useNavigator from '@/hooks/useNavigator';
import * as Styled from './WebviewMenuPage.styles';

const PRIVACY_POLICY_URL =
  'https://honorable-cough-8f9.notion.site/232aad23209680f2a2cadb146eff81cd?pvs=74';

const MENU_ITEMS = [
  { label: '서비스 소개', to: '/introduce' },
  { label: '총 동아리 연합회', to: '/club-union' },
  { label: '개인정보 처리방침', to: PRIVACY_POLICY_URL },
] as const;

const WebviewMenuPage = () => {
  useTrackPageView(PAGE_VIEW.WEBVIEW_MENU_PAGE);
  const handleLink = useNavigator();
  const trackEvent = useMixpanelTrack();
  const appVersion = useAppVersion();

  const handleClick = (label: string, to: string) => {
    trackEvent(USER_EVENT.WEBVIEW_MENU_CLICKED, { menu: label });
    handleLink(to);
  };

  return (
    <Styled.PageContainer>
      <Styled.MenuList>
        {MENU_ITEMS.map((item) => (
          <Styled.MenuItem
            key={item.label}
            type='button'
            onClick={() => handleClick(item.label, item.to)}
          >
            {item.label}
          </Styled.MenuItem>
        ))}
      </Styled.MenuList>
      {appVersion && <Styled.Version>앱 버전 {appVersion}</Styled.Version>}
    </Styled.PageContainer>
  );
};

export default WebviewMenuPage;

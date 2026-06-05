import { useLocation, useNavigate } from 'react-router-dom';
import homeIcon from '@/assets/images/icons/bottomNav/home.svg';
import menuIcon from '@/assets/images/icons/bottomNav/menu.svg';
import subscribeSelected from '@/assets/images/icons/bottomNav/subscribe_selected.png';
import subscribeUnselected from '@/assets/images/icons/bottomNav/subscribe_unselected.png';
import { USER_EVENT } from '@/constants/eventName';
import useMixpanelTrack from '@/hooks/Mixpanel/useMixpanelTrack';
import * as Styled from './BottomNavigation.styles';

type TabIcon =
  | { type: 'mask'; src: string }
  | { type: 'image'; active: string; inactive: string };

interface BottomNavTab {
  key: string;
  label: string;
  path: string;
  icon: TabIcon;
}

const TABS: BottomNavTab[] = [
  {
    key: 'home',
    label: '홈',
    path: '/',
    icon: { type: 'mask', src: homeIcon },
  },
  {
    key: 'explore',
    label: '구독',
    path: '/subscriptions',
    icon: {
      type: 'image',
      active: subscribeSelected,
      inactive: subscribeUnselected,
    },
  },
  {
    key: 'more',
    label: '메뉴',
    path: '/menu',
    icon: { type: 'mask', src: menuIcon },
  },
];

const isTabActive = (pathname: string, path: string) =>
  path === '/' ? pathname === '/' : pathname.startsWith(path);

const BottomNavigation = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const trackEvent = useMixpanelTrack();

  const handleTabClick = (tab: BottomNavTab) => {
    trackEvent(USER_EVENT.BOTTOM_TAB_CLICKED, { tab: tab.key, path: tab.path });
    navigate(tab.path);
  };

  return (
    <Styled.Nav aria-label='하단 네비게이션'>
      {TABS.map((tab) => {
        const active = isTabActive(pathname, tab.path);
        return (
          <Styled.Tab
            key={tab.key}
            type='button'
            aria-current={active ? 'page' : undefined}
            onClick={() => handleTabClick(tab)}
          >
            {tab.icon.type === 'mask' ? (
              <Styled.MaskIcon
                $icon={tab.icon.src}
                $active={active}
                aria-hidden
              />
            ) : (
              <Styled.ImageIcon
                src={active ? tab.icon.active : tab.icon.inactive}
                alt=''
                aria-hidden
              />
            )}
            <Styled.Label $active={active}>{tab.label}</Styled.Label>
          </Styled.Tab>
        );
      })}
    </Styled.Nav>
  );
};

export default BottomNavigation;

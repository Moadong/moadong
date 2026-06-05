import { useLocation, useNavigate } from 'react-router-dom';
import HomeIcon from '@/assets/images/icons/bottomNav/home.svg?react';
import MenuIcon from '@/assets/images/icons/bottomNav/menu.svg?react';
import subscribeSelected from '@/assets/images/icons/bottomNav/subscribe_selected.png';
import subscribeUnselected from '@/assets/images/icons/bottomNav/subscribe_unselected.png';
import { USER_EVENT } from '@/constants/eventName';
import useMixpanelTrack from '@/hooks/Mixpanel/useMixpanelTrack';
import * as Styled from './BottomNavigation.styles';

type SvgComponent = React.ComponentType<React.SVGProps<SVGSVGElement>>;

type TabIcon =
  | { type: 'vector'; Component: SvgComponent }
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
    icon: { type: 'vector', Component: HomeIcon },
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
    icon: { type: 'vector', Component: MenuIcon },
  },
];

const isTabActive = (pathname: string, path: string) =>
  path === '/' ? pathname === '/' : pathname.startsWith(path);

const renderIcon = (icon: TabIcon, active: boolean) => {
  if (icon.type === 'vector') {
    const Icon = icon.Component;
    return <Icon width={28} height={28} aria-hidden />;
  }
  return (
    <Styled.ImageIcon
      src={active ? icon.active : icon.inactive}
      alt=''
      aria-hidden
    />
  );
};

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
            $active={active}
            aria-current={active ? 'page' : undefined}
            onClick={() => handleTabClick(tab)}
          >
            {renderIcon(tab.icon, active)}
            <Styled.Label>{tab.label}</Styled.Label>
          </Styled.Tab>
        );
      })}
    </Styled.Nav>
  );
};

export default BottomNavigation;

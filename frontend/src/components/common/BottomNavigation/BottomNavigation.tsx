import { useLocation, useNavigate } from 'react-router-dom';
import HomeIcon from '@/assets/images/icons/bottomNav/home.svg?react';
import MenuIcon from '@/assets/images/icons/bottomNav/menu.svg?react';
import SubscribeIcon from '@/assets/images/icons/bottomNav/subscribe.svg?react';
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
    key: 'subscriptions',
    label: '구독',
    path: '/subscriptions',
    icon: { type: 'vector', Component: SubscribeIcon },
  },
  {
    key: 'more',
    label: '메뉴',
    path: '/menu',
    icon: { type: 'vector', Component: MenuIcon },
  },
];

const isTabActive = (pathname: string, path: string) => {
  // 홈 탭: 메인 + 상단 Filter로 묶이는 홍보까지 활성
  if (path === '/') {
    return pathname === '/' || pathname === '/promotions';
  }
  // 메뉴 탭: 메뉴 페이지에서 진입하는 소개/연합회 하위 페이지까지 활성
  if (path === '/menu') {
    return (
      pathname.startsWith('/menu') ||
      pathname === '/introduce' ||
      pathname === '/club-union'
    );
  }
  return pathname.startsWith(path);
};

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
    navigate(tab.path, { replace: true });
  };

  return (
    <Styled.Nav aria-label='하단 네비게이션'>
      <Styled.Inner>
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
      </Styled.Inner>
    </Styled.Nav>
  );
};

export default BottomNavigation;

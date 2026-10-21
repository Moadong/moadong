import { useLocation, useNavigate } from 'react-router-dom';
import HomeIcon from '@/assets/images/icons/bottomNav/home.svg?react';
import MenuIcon from '@/assets/images/icons/bottomNav/menu.svg?react';
import PromotionIcon from '@/assets/images/icons/bottomNav/promotion.svg?react';
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

const HOME_TAB: BottomNavTab = {
  key: 'home',
  label: '홈',
  path: '/',
  icon: { type: 'vector', Component: HomeIcon },
};

// 구독 진입점은 이 탭 하나다(홈 헤더의 구독 벨은 2026-10 제거)
const SUBSCRIPTIONS_TAB: BottomNavTab = {
  key: 'subscriptions',
  label: '구독',
  path: '/subscriptions',
  icon: { type: 'vector', Component: SubscribeIcon },
};

const COMMON_TABS: BottomNavTab[] = [
  {
    key: 'promotions',
    label: '홍보',
    path: '/promotions',
    icon: { type: 'vector', Component: PromotionIcon },
  },
  {
    key: 'more',
    label: '메뉴',
    path: '/menu',
    icon: { type: 'vector', Component: MenuIcon },
  },
];

const isTabActive = (pathname: string, path: string) => {
  if (path === '/') {
    return pathname === '/';
  }
  // 메뉴 탭: 메뉴 페이지에서 진입하는 소개/연합회 하위 페이지까지 활성
  if (path === '/menu') {
    return (
      pathname === '/menu' ||
      pathname.startsWith('/menu/') ||
      pathname === '/introduce' ||
      pathname === '/club-union'
    );
  }
  return pathname === path || pathname.startsWith(path + '/');
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

interface BottomNavigationProps {
  /** 홍보 탭 알림. 'dot'은 점, 숫자는 새 글 수(0이면 표시 없음, 10 이상은 9+) */
  promotionNotification?: number | 'dot';
}

const getPromotionAriaLabel = (
  label: string,
  notification: number | 'dot',
): string | undefined => {
  if (notification === 'dot') return `${label}, 새 글 있음`;
  if (notification <= 0) return undefined;
  if (notification > 9) return `${label}, 새 글 9개 이상`;
  return `${label}, 새 글 ${notification}개`;
};

const BottomNavigation = ({
  promotionNotification = 0,
}: BottomNavigationProps) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const trackEvent = useMixpanelTrack();

  const tabs = [HOME_TAB, SUBSCRIPTIONS_TAB, ...COMMON_TABS];

  const handleTabClick = (tab: BottomNavTab) => {
    trackEvent(USER_EVENT.BOTTOM_TAB_CLICKED, { tab: tab.key, path: tab.path });
    navigate(tab.path, { replace: true });
  };

  const isHome = pathname === '/' || pathname === '/promotions';

  return (
    <Styled.Nav aria-label='하단 네비게이션' $isHome={isHome}>
      <Styled.Inner>
        {tabs.map((tab) => {
          const active = isTabActive(pathname, tab.path);
          const ariaLabel =
            tab.key === 'promotions'
              ? getPromotionAriaLabel(tab.label, promotionNotification)
              : undefined;
          return (
            <Styled.Tab
              key={tab.key}
              type='button'
              $active={active}
              aria-current={active ? 'page' : undefined}
              aria-label={ariaLabel}
              onClick={() => handleTabClick(tab)}
            >
              {renderIcon(tab.icon, active)}
              {tab.key === 'promotions' && promotionNotification === 'dot' && (
                <Styled.NotificationDot aria-hidden />
              )}
              {tab.key === 'promotions' &&
                typeof promotionNotification === 'number' &&
                promotionNotification > 0 && (
                  <Styled.NotificationBadge aria-hidden>
                    {promotionNotification > 9 ? '9+' : promotionNotification}
                  </Styled.NotificationBadge>
                )}
              <Styled.Label>{tab.label}</Styled.Label>
            </Styled.Tab>
          );
        })}
      </Styled.Inner>
    </Styled.Nav>
  );
};

export default BottomNavigation;

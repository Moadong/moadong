import { useLocation, useNavigate } from 'react-router-dom';
import NotificationIcon from '@/assets/images/icons/notification_icon_home.svg';
import MobileMainIcon from '@/assets/images/logos/moadong_mobile_logo.svg';
import DesktopMainIcon from '@/assets/images/moadong_name_logo.svg';
import AdminProfile from '@/components/common/Header/admin/AdminProfile';
import SearchBox from '@/components/common/SearchBox/SearchBox';
import { USER_EVENT } from '@/constants/eventName';
import useHeaderNavigation from '@/hooks/Header/useHeaderNavigation';
import useHeaderVisibility from '@/hooks/Header/useHeaderVisibility';
import useMixpanelTrack from '@/hooks/Mixpanel/useMixpanelTrack';
import { useScrollDetection } from '@/hooks/Scroll/useScrollDetection';
import { DeviceType } from '@/types/device';
import * as Styled from './Header.styles';

interface HeaderProps {
  showOn?: DeviceType[];
  hideOn?: DeviceType[];
  /** 구독 목록으로 가는 벨. 구독은 앱 브리지 기능이라 웹뷰 화면에서만 켠다. */
  showSubscriptionBell?: boolean;
}

const Header = ({ showOn, hideOn, showSubscriptionBell }: HeaderProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const trackEvent = useMixpanelTrack();
  const isScrolled = useScrollDetection();
  const isVisible = useHeaderVisibility(showOn, hideOn);
  const {
    handleHomeClick,
    handleIntroduceClick,
    handleClubUnionClick,
    handlePromotionClick,
  } = useHeaderNavigation();

  const isAdminPage = location.pathname.startsWith('/admin');
  const isAdminLoginPage = location.pathname.startsWith('/admin/login');

  const navLinks = [
    { label: '모아동 소개', handler: handleIntroduceClick, path: '/introduce' },
    {
      label: '총동아리연합회 소개',
      handler: handleClubUnionClick,
      path: '/club-union',
    },
    {
      label: '홍보•이벤트',
      handler: handlePromotionClick,
      path: '/promotions',
    },
  ];

  const handleSubscriptionClick = () => {
    trackEvent(USER_EVENT.HOME_SUBSCRIPTION_CLICKED);
    navigate('/subscriptions');
  };

  if (!isVisible) {
    return null;
  }

  return (
    <Styled.Header isScrolled={isScrolled}>
      <Styled.Container>
        <Styled.LeftSection>
          <Styled.LogoButton onClick={handleHomeClick} aria-label='홈으로 이동'>
            <img
              className='desktop-logo'
              src={DesktopMainIcon}
              alt='모아동 로고'
            />
            <img
              className='mobile-logo'
              src={MobileMainIcon}
              alt='모아동 로고'
            />
          </Styled.LogoButton>
          {!isAdminPage && (
            <Styled.Nav>
              {navLinks.map((link) => (
                <Styled.NavLink
                  key={link.label}
                  $isActive={location.pathname === link.path}
                  onClick={link.handler}
                >
                  {link.label}
                </Styled.NavLink>
              ))}
            </Styled.Nav>
          )}
        </Styled.LeftSection>

        {!isAdminPage && (
          <Styled.SearchArea>
            <SearchBox />
          </Styled.SearchArea>
        )}
        {!isAdminPage && showSubscriptionBell && (
          <Styled.SubscriptionBellButton
            onClick={handleSubscriptionClick}
            aria-label='구독한 동아리'
          >
            <img src={NotificationIcon} alt='' aria-hidden />
          </Styled.SubscriptionBellButton>
        )}
        {isAdminPage && !isAdminLoginPage && <AdminProfile />}
      </Styled.Container>
    </Styled.Header>
  );
};

export default Header;

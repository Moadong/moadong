import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import MobileMainIcon from '@/assets/images/logos/moadong_mobile_logo.svg';
import DesktopMainIcon from '@/assets/images/moadong_name_logo.svg';
import AdminProfile from '@/components/common/Header/admin/AdminProfile';
import { USER_EVENT } from '@/constants/eventName';
import useHeaderNavigation from '@/hooks/Header/useHeaderNavigation';
import useMixpanelTrack from '@/hooks/Mixpanel/useMixpanelTrack';
import { useScrollDetection } from '@/hooks/Scroll/useScrollDetection';
import SearchBox from '@/pages/MainPage/components/SearchBox/SearchBox';
import * as Styled from './Header.styles';

const Header = () => {
  const trackEvent = useMixpanelTrack();
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');
  const isAdminLoginPage = location.pathname.startsWith('/admin/login');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isScrolled = useScrollDetection();

  const {
    handleHomeClick,
    handleIntroduceClick,
    handleClubUnionClick,
    handleAdminClick,
  } = useHeaderNavigation();

  const navLinks = [
    { label: '모아동 소개', handler: handleIntroduceClick, path: '/introduce' },
    {
      label: '총동아리연합회 소개',
      handler: handleClubUnionClick,
      path: '/club-union',
    },
    { label: '관리자 페이지', handler: handleAdminClick, path: '/admin' },
  ];

  const closeMenu = () => {
    setIsMenuOpen(false);
    trackEvent(USER_EVENT.MOBILE_MENU_DELETE_BUTTON_CLICKED);
  };
  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

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

          <Styled.Nav isOpen={isMenuOpen}>
            {navLinks.map((link) => (
              <Styled.NavLink
                key={link.label}
                isActive={location.pathname === link.path}
                onClick={() => {
                  link.handler();
                  closeMenu();
                }}
              >
                {link.label}
              </Styled.NavLink>
            ))}
          </Styled.Nav>
        </Styled.LeftSection>

        {!isAdminPage && (
          <Styled.MenuButton
            onClick={toggleMenu}
            isOpen={isMenuOpen}
            aria-label={isMenuOpen ? '메뉴 닫기' : '메뉴 열기'}
          >
            <Styled.MenuBar />
            <Styled.MenuBar />
            <Styled.MenuBar />
          </Styled.MenuButton>
        )}

        {!isAdminPage && <SearchBox />}
        {isAdminPage && !isAdminLoginPage && <AdminProfile />}
      </Styled.Container>
    </Styled.Header>
  );
};

export default Header;

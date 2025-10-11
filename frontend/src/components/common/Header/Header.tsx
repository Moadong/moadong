import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import * as Styled from './Header.styles';

import useMixpanelTrack from '@/hooks/useMixpanelTrack';
import { EVENT_NAME } from '@/constants/eventName';

import SearchBox from '@/pages/MainPage/components/SearchBox/SearchBox';
import useHeaderService from '@/components/common/Header/useHeaderNavigation';
import DesktopMainIcon from '@/assets/images/moadong_name_logo.svg';
import MobileMainIcon from '@/assets/images/logos/moadong_mobile_logo.svg';

const Header = () => {
  const trackEvent = useMixpanelTrack();
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const {
    handleHomeClick,
    handleIntroduceClick,
    handleClubUnionClick,
    handlePatchNoteClick,
  } = useHeaderService();

  const navLinks = [
    { label: '모아동 소개', handler: handleIntroduceClick, path: '/introduce' },
    {
      label: '총동아리연합회 소개',
      handler: handleClubUnionClick,
      path: '/club-union',
    },
    { label: '패치노트', handler: handlePatchNoteClick, path: '/patch-note' },
  ];

  const closeMenu = () => {
    setIsMenuOpen(false);
    trackEvent(EVENT_NAME.MOBILE_MENU_DELETE_BUTTON_CLICKED);
  };
  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  return (
    <>
      <Styled.Header>
        <Styled.Container>
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
          )}

          {/* TODO 동아리 관리자 프로필 추가 */}
          {!isAdminPage && <SearchBox />}

          <Styled.MenuButton
            onClick={toggleMenu}
            isOpen={isMenuOpen}
            aria-label={isMenuOpen ? '메뉴 닫기' : '메뉴 열기'}
          >
            <Styled.MenuBar />
            <Styled.MenuBar />
            <Styled.MenuBar />
          </Styled.MenuButton>
        </Styled.Container>
      </Styled.Header>
    </>
  );
};

export default Header;

import { memo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import * as Styled from './Header.styles';

import SearchBox from '@/pages/MainPage/components/SearchBox/SearchBox';
import useIsMobile from '@/hooks/useIsMobile';
import useMobileMenu from '@/services/header/useMobileMenu';
import useHeaderService from '@/services/header/useHeaderService';

import DesktopMainIcon from '@/assets/images/moadong_name_logo.svg';
import MobileMainIcon from '@/assets/images/logos/moadong_mobile_logo.svg';
import MenuBarIcon from '@/assets/images/icons/menu_button_icon.svg';
import DeleteIcon from '@/assets/images/introduce/delete.png';

interface NavLinkData {
  label: string;
  handler: () => void;
}

interface DesktopHeaderProps {
  isAdminPage: boolean;
  navLinks: NavLinkData[];
  onHomeClick: () => void;
}

interface MobileHeaderProps {
  onHomeClick: () => void;
  onMenuClick: () => void;
}

interface MobileMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  navLinks: NavLinkData[];
  onHomeClick: () => void;
}

const DesktopHeader = memo(
  ({ isAdminPage, navLinks, onHomeClick }: DesktopHeaderProps) => {
    const [isDropdownOpen, setDropdownOpen] = useState(false);

    return (
    <Styled.HeaderStyles>
      <Styled.HeaderContainer>
        <Styled.TextCoverStyles>
          <Styled.LogoButtonStyles
            onClick={onHomeClick}
            aria-label='홈으로 이동'
          >
            <img src={DesktopMainIcon} alt='모아동 로고' />
          </Styled.LogoButtonStyles>

          {!isAdminPage &&
            navLinks.map((link) => (
              <Styled.IntroduceButtonStyles
                key={link.label}
                onClick={link.handler}
              >
                {link.label}
              </Styled.IntroduceButtonStyles>
            ))}
          {/*드랍 다운 페이지*/}
          {!isAdminPage && (
              <Styled.DropdownContainer
                onMouseEnter={() => setDropdownOpen(true)}
                onMouseLeave={() => setDropdownOpen(false)}
              >
                {/* <Styled.IntroduceButtonStyles as='div'>
                  공지사항
                </Styled.IntroduceButtonStyles> */}
                <span>공지사항</span>
                
                {isDropdownOpen && (
                  <Styled.DropdownMenu>
                    <Styled.DropdownItem
                      onClick={() =>
                        window.open(
                          'https://honorable-cough-8f9.notion.site/1e8aad232096804f9ea9ee4f5cf0cd10',
                          '_blank',
                        )
                      }
                    >
                      패치 노트
                    </Styled.DropdownItem>
                    {/* 다른 메뉴 아이템이 필요하면 여기에 추가할 수 있습니다. */}
                  </Styled.DropdownMenu>
                )}
              </Styled.DropdownContainer>
            )}

        </Styled.TextCoverStyles>
        {!isAdminPage && <SearchBox />}
      </Styled.HeaderContainer>
    </Styled.HeaderStyles>
  );
  },
);

const MobileMenuDrawer = memo(
  ({ isOpen, onClose, navLinks, onHomeClick }: MobileMenuDrawerProps) => (
    <Styled.DrawerContainer isOpen={isOpen}>
      <Styled.DrawerHeader>
        <Styled.DrawerMainIcon
          src={DesktopMainIcon}
          alt='모아동 로고'
          onClick={onHomeClick}
        />
        <Styled.DrawerDeleteIcon
          src={DeleteIcon}
          alt='메뉴 닫기'
          onClick={onClose}
        />
      </Styled.DrawerHeader>
      {navLinks.map((link) => (
        <Styled.MenubarIntroduceBox
          key={link.label}
          onClick={() => {
            link.handler();
            onClose();
          }}
        >
          {link.label}
        </Styled.MenubarIntroduceBox>
      ))}
    </Styled.DrawerContainer>
  ),
);

const MobileHeader = memo(({ onHomeClick, onMenuClick }: MobileHeaderProps) => (
  <Styled.MobileHeaderContainer>
    <Styled.MobileHeaderWrapper>
      <Styled.MobileMainIcon onClick={onHomeClick} aria-label='홈으로 이동'>
        <img src={MobileMainIcon} alt='모아동 로고' />
      </Styled.MobileMainIcon>
      <SearchBox />
      <Styled.MobileMenu onClick={onMenuClick} aria-label='메뉴 열기'>
        <img src={MenuBarIcon} alt='' />
      </Styled.MobileMenu>
    </Styled.MobileHeaderWrapper>
  </Styled.MobileHeaderContainer>
));

const Header = () => {
  const isMobile = useIsMobile();
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  const {
    handleHomeClick,
    handleIntroduceClick,
    handleClubUnionClick,
    handleMenuClick,
  } = useHeaderService();

  const { isMenuOpen, openMenu, closeMenu } = useMobileMenu({
    handleMenuClick,
  });

  const navLinks: NavLinkData[] = [
    { label: '모아동 소개', handler: handleIntroduceClick },
    { label: '총동아리연합회 소개', handler: handleClubUnionClick },
  ];

  return (
    <>
      {isMobile ? (
        <MobileHeader
          onHomeClick={() => handleHomeClick('mobile')}
          onMenuClick={openMenu}
        />
      ) : (
        <DesktopHeader
          isAdminPage={isAdminPage}
          navLinks={navLinks}
          onHomeClick={() => handleHomeClick('desktop')}
        />
      )}
      <MobileMenuDrawer
        isOpen={isMenuOpen}
        onClose={closeMenu}
        navLinks={navLinks}
        onHomeClick={() => {
          handleHomeClick('mobile');
          closeMenu();
        }}
      />
    </>
  );
};

export default Header;

import { useLocation } from 'react-router-dom';
import * as Styled from './Header.styles';
import SearchBox from '@/components/common/SearchBox/SearchBox';
import useHeaderService from '@/services/header/useHeaderService';
import useMobileMenu from '@/services/header/useMobileMenu';
import useIsMobile from '@/hooks/useIsMobile';
import DesktopMainIcon from '@/assets/images/moadong_name_logo.svg';
import MobileMainIcon from '@/assets/images/logos/moadong_mobile_logo.svg';
import MenuBar from '@/assets/images/icons/menu_button_icon.svg';
import DeleteIcon from '@/assets/images/introduce/delete.png';

interface MobileHeaderProps {
  handleHomeClick: (device: 'mobile' | 'desktop') => void;
  handleMenuClick: () => void;
}

interface DesktopHeaderProps {
  isAdminPage: boolean;
  handleHomeClick: (device: 'mobile' | 'desktop') => void;
  handleIntroduceClick: () => void;
}

interface MobileMenuProp {
  isOpen: boolean;
  onClose: () => void;
  handleHomeClick: (device: 'mobile' | 'desktop') => void;
  handleIntroduceClick: () => void;
}

const MobileMenuDrawer = ({
  isOpen,
  onClose,
  handleHomeClick,
  handleIntroduceClick,
}: MobileMenuProp) => {
  return (
    <Styled.DrawerContainer isOpen={isOpen}>
      <Styled.DrawerWrapper>
        <Styled.DrawerHeader>
          <Styled.DrawerMainIcon
            src={DesktopMainIcon}
            alt='홈 버튼'
            onClick={() => handleHomeClick('mobile')}
          />
          <Styled.DrawerDeleteIcon
            src={DeleteIcon}
            alt='삭제 버튼'
            onClick={onClose}
          />
        </Styled.DrawerHeader>
        <Styled.MenubarIntroduceBox onClick={handleIntroduceClick}>
          모아동 소개
        </Styled.MenubarIntroduceBox>
      </Styled.DrawerWrapper>
    </Styled.DrawerContainer>
  );
};

const MobileHeader = ({
  handleHomeClick,
  handleMenuClick,
}: MobileHeaderProps) => (
  <Styled.MobileHeaderContainer>
    <Styled.MobileHeaderWrapper>
      <Styled.MobileMainIcon>
        <img
          src={MobileMainIcon}
          alt='홈 버튼'
          onClick={() => handleHomeClick('mobile')}
        />
      </Styled.MobileMainIcon>
      <SearchBox />
      <Styled.MobileMenu aria-label='메뉴 버튼'>
        <img src={MenuBar} alt='메뉴 버튼' onClick={handleMenuClick} />
      </Styled.MobileMenu>
    </Styled.MobileHeaderWrapper>
  </Styled.MobileHeaderContainer>
);

const DesktopHeader = ({
  isAdminPage,
  handleHomeClick,
  handleIntroduceClick,
}: DesktopHeaderProps) => (
  <Styled.HeaderStyles>
    <Styled.HeaderContainer>
      <Styled.TextCoverStyles>
        <Styled.LogoButtonStyles>
          <img
            src={DesktopMainIcon}
            alt='홈 버튼'
            onClick={() => handleHomeClick('desktop')}
          />
        </Styled.LogoButtonStyles>
        {!isAdminPage && (
          <Styled.IntroduceButtonStyles onClick={handleIntroduceClick}>
            모아동 소개
          </Styled.IntroduceButtonStyles>
        )}
      </Styled.TextCoverStyles>
      {!isAdminPage && <SearchBox />}
    </Styled.HeaderContainer>
  </Styled.HeaderStyles>
);

const Header = () => {
  const isMobile = useIsMobile();
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  const { handleHomeClick, handleIntroduceClick, handleMenuClick } =
    useHeaderService();

  const { isMenuOpen, openMenu, closeMenu } = useMobileMenu({
    handleMenuClick,
  });

  return isMobile ? (
    <>
      <MobileHeader
        handleHomeClick={handleHomeClick}
        handleMenuClick={openMenu}
      />
      <MobileMenuDrawer
        isOpen={isMenuOpen}
        onClose={closeMenu}
        handleHomeClick={handleHomeClick}
        handleIntroduceClick={handleIntroduceClick}
      />
    </>
  ) : (
    <DesktopHeader
      isAdminPage={isAdminPage}
      handleHomeClick={handleHomeClick}
      handleIntroduceClick={handleIntroduceClick}
    />
  );
};

export default Header;

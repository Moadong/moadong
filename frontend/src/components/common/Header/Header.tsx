import React from 'react';
import { useLocation } from 'react-router-dom';
import * as Styled from './Header.styles';
import SearchBox from '@/components/common/SearchBox/SearchBox';
import useHeaderService from '@/services/header/useHeaderService';
import useIsMobile from '@/hooks/useIsMobile';
import DesktopMainIcon from '@/assets/images/moadong_name_logo.svg';
import MobileMainIcon from '@/assets/images/logos/moadong_mobile_logo.svg';
import MenuBar from '@/assets/images/icons/menu_button_icon.svg';

interface MobileHeaderProps {
  handleHomeClick: (device: 'mobile' | 'desktop') => void;
  handleMenuClick: () => void;
}

interface DesktopHeaderProps {
  isAdminPage: boolean;
  handleHomeClick: (device: 'mobile' | 'desktop') => void;
  handleIntroduceClick: () => void;
}

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

  return isMobile ? (
    <MobileHeader
      handleHomeClick={handleHomeClick}
      handleMenuClick={handleMenuClick}
    />
  ) : (
    <DesktopHeader
      isAdminPage={isAdminPage}
      handleHomeClick={handleHomeClick}
      handleIntroduceClick={handleIntroduceClick}
    />
  );
};

export default Header;

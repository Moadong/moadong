import React from 'react';
import useMixpanelTrack from '@/hooks/useMixpanelTrack';
import * as Styled from './MobileHeader.styles';
import MainIcon from '@/assets/images/mainIcon.png';
import SearchIcon from '@/assets/images/searchIcon.png';
import MenuBar from '@/assets/images/menubar.png';
import { useNavigate } from 'react-router-dom';

const MainMobileHeader = () => {
  const navigate = useNavigate();
  const trackEvent = useMixpanelTrack();

  const handleHomeClick = () => {
    trackEvent('Mobile Home Button Clicked');
    navigate('/');
  };

  const handleSearchClick = () => {
    trackEvent('Mobile Search Button Clicked');
  };

  const handleMenuClick = () => {
    trackEvent('Mobile Menu Button Clicked');
  };

  return (
    <Styled.MobileHeaderContainer>
      <Styled.MobileHeaderWrapper>
        <Styled.MobileMainIcon>
          <img src={MainIcon} onClick={handleHomeClick} />
        </Styled.MobileMainIcon>
        <Styled.MobileSubContainer>
          <Styled.MobileSearchIcon>
            <img src={SearchIcon} onClick={handleSearchClick} />
          </Styled.MobileSearchIcon>
          <Styled.MobileMenu>
            <img src={MenuBar} onClick={handleMenuClick} />
          </Styled.MobileMenu>
        </Styled.MobileSubContainer>
      </Styled.MobileHeaderWrapper>
    </Styled.MobileHeaderContainer>
  );
};
export default MainMobileHeader;

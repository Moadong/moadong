import React from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBox from '@/components/common/SearchBox/SearchBox';
import useMixpanelTrack from '@/hooks/useMixpanelTrack';
import * as Styled from './MobileHeader.styles';
import MainIcon from '@/assets/images/logos/moadong_mobile_logo.png';
import MenuBar from '@/assets/images/icons/menu_button_icon.svg';
import { useSearch } from '@/context/SearchContext';

const MainMobileHeader = () => {
  const { setKeyword, setInputValue } = useSearch();
  const navigate = useNavigate();
  const trackEvent = useMixpanelTrack();

  const handleHomeClick = () => {
    navigate('/');
    setKeyword('');
    setInputValue('');
    trackEvent('Mobile Home Button Clicked');
  };

  const handleMenuClick = () => {
    trackEvent('Mobile Menu Button Clicked');
  };

  return (
    <Styled.MobileHeaderContainer>
      <Styled.MobileHeaderWrapper>
        <Styled.MobileMainIcon>
          <img src={MainIcon} alt='홈 버튼' onClick={handleHomeClick} />
        </Styled.MobileMainIcon>
        <SearchBox />
        <Styled.MobileMenu aria-label='메뉴 버튼'>
          <img src={MenuBar} alt='메뉴 버튼' onClick={handleMenuClick} />
        </Styled.MobileMenu>
      </Styled.MobileHeaderWrapper>
    </Styled.MobileHeaderContainer>
  );
};

export default MainMobileHeader;

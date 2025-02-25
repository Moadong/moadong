import React from 'react';
import * as Styled from './MobileHeader.styles';
import MainIcon from '@/assets/images/mainIcon.png';
import SearchIcon from '@/assets/images/searchIcon.png';
import MenuBar from '@/assets/images/menubar.png';
import { useNavigate } from 'react-router-dom';

const MainMobileHeader = () => {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate('/');
  };

  return (
    <Styled.MobileHeaderContainer>
      <Styled.MobileHeaderWrapper>
        <Styled.MobileMainIcon>
          <img src={MainIcon} onClick={handleHomeClick} />
        </Styled.MobileMainIcon>
        <Styled.MobileSubContainer>
          <Styled.MobileSearchIcon>
            <img src={SearchIcon} />
          </Styled.MobileSearchIcon>
          <Styled.MobileMenu>
            <img src={MenuBar} />
          </Styled.MobileMenu>
        </Styled.MobileSubContainer>
      </Styled.MobileHeaderWrapper>
    </Styled.MobileHeaderContainer>
  );
};
export default MainMobileHeader;

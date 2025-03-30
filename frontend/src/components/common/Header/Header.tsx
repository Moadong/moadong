import React from 'react';
import useMixpanelTrack from '@/hooks/useMixpanelTrack';
import * as Styled from './Header.styles';
import SearchBox from '@/components/common/SearchBox/SearchBox';
import MainIcon from '@/assets/images/moadong_name_logo.svg';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const trackEvent = useMixpanelTrack();

  const handleHomeClick = () => {
    trackEvent('Home Button Clicked');
    navigate('/');
  };

  const handleIntroduceClick = () => {
    trackEvent('Introduce Button Clicked');
    window.location.href =
      'https://valiant-schooner-12c.notion.site/1a64ac84bab3805287e0cef50b563370';
  };

  return (
    <Styled.HeaderStyles>
      <Styled.HeaderContainer>
        <Styled.TextCoverStyles>
          <Styled.LogoButtonStyles>
            <img src={MainIcon} alt='홈 버튼' onClick={handleHomeClick} />
          </Styled.LogoButtonStyles>
          <Styled.IntroduceButtonStyles onClick={handleIntroduceClick}>
            모아동 소개
          </Styled.IntroduceButtonStyles>
        </Styled.TextCoverStyles>
        <SearchBox />
      </Styled.HeaderContainer>
    </Styled.HeaderStyles>
  );
};

export default Header;

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useMixpanelTrack from '@/hooks/useMixpanelTrack';
import * as Styled from './Header.styles';
import SearchBox from '@/components/common/SearchBox/SearchBox';
import MainIcon from '@/assets/images/moadong_name_logo.svg';
import { useSearch } from '@/context/SearchContext';

const Header = () => {
  const { setKeyword, setInputValue } = useSearch();
  const navigate = useNavigate();
  const location = useLocation();
  const trackEvent = useMixpanelTrack();

  const handleHomeClick = () => {
    navigate('/');
    setKeyword('');
    setInputValue('');
    trackEvent('Home Button Clicked');
  };

  const handleIntroduceClick = () => {
    window.location.href =
      'https://valiant-schooner-12c.notion.site/1a64ac84bab3805287e0cef50b563370';
    trackEvent('Introduce Button Clicked');
  };

  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <Styled.HeaderStyles>
      <Styled.HeaderContainer>
        <Styled.TextCoverStyles>
          <Styled.LogoButtonStyles>
            <img src={MainIcon} alt='홈 버튼' onClick={handleHomeClick} />
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
};

export default Header;

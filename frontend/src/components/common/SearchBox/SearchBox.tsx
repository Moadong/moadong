import React, { useState } from 'react';
import { useSearch } from '@/context/SearchContext';
import useMixpanelTrack from '@/hooks/useMixpanelTrack';
import * as Styled from './SearchBox.styles';
import SearchIcon from '@/assets/images/icons/search_button_icon.svg';
import { useNavigate } from 'react-router-dom';

const SearchBox = () => {
  const [isSearchBoxClicked, setIsSearchBoxClicked] = useState(false);
  const { keyword, setKeyword } = useSearch();
  const trackEvent = useMixpanelTrack();
  const navigate = useNavigate();

  const handleSearchClick = () => {
    redirectToMainIfSearchTriggeredOutside();

    if (!keyword.trim()) {
      return;
    }

    trackEvent('Search Executed', {
      keyword,
      page: window.location.pathname,
    });

    setKeyword(keyword);
  };

  const redirectToMainIfSearchTriggeredOutside = () => {
    if (window.location.pathname !== '/') {
      navigate('/');
    }
  };

  return (
    <Styled.SearchBoxContainer isFocused={isSearchBoxClicked}>
      <Styled.SearchInputStyles
        placeholder='어떤 동아리를 찾으세요?'
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />
      <Styled.SearchButton type='button' onClick={handleSearchClick}>
        <img src={SearchIcon} alt='Search Button' />
      </Styled.SearchButton>
    </Styled.SearchBoxContainer>
  );
};

export default SearchBox;

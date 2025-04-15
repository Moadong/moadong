import React, { useState } from 'react';
import { useSearch } from '@/context/SearchContext';
import useMixpanelTrack from '@/hooks/useMixpanelTrack';
import * as Styled from './SearchBox.styles';
import SearchIcon from '@/assets/images/icons/search_button_icon.svg';
import { useNavigate } from 'react-router-dom';

const SearchBox = () => {
  const [isSearchBoxClicked, setIsSearchBoxClicked] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const { setKeyword } = useSearch();
  const trackEvent = useMixpanelTrack();
  const navigate = useNavigate();

  const redirectToMainIfSearchTriggeredOutside = () => {
    if (window.location.pathname !== '/') {
      navigate('/');
    }
  };

  const handleSearchClick = () => {
    redirectToMainIfSearchTriggeredOutside();
    setKeyword(inputValue);

    trackEvent('Search Executed', {
      inputValue,
      page: window.location.pathname,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };
  return (
    <Styled.SearchBoxContainer isFocused={isSearchBoxClicked}>
      <Styled.SearchInputStyles
        type='text'
        placeholder='어떤 동아리를 찾으세요?'
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onFocus={() => setIsSearchBoxClicked(true)}
        onBlur={() => setIsSearchBoxClicked(false)}
        aria-label='동아리 검색창'
      />
      <Styled.SearchButton
        type='submit'
        onClick={handleSearchClick}
        isFocused={isSearchBoxClicked}
        aria-label='검색'>
        <img src={SearchIcon} alt='Search Button' />
      </Styled.SearchButton>
    </Styled.SearchBoxContainer>
  );
};

export default SearchBox;

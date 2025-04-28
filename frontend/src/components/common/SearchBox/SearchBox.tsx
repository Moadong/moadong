import React, { useRef, useState } from 'react';
import { useSearch } from '@/context/SearchContext';
import useMixpanelTrack from '@/hooks/useMixpanelTrack';
import * as Styled from './SearchBox.styles';
import SearchIcon from '@/assets/images/icons/search_button_icon.svg';
import { useLocation, useNavigate } from 'react-router-dom';

const SearchBox = () => {
  const [isSearchBoxClicked, setIsSearchBoxClicked] = useState(false);
  const { setKeyword, inputValue, setInputValue } = useSearch();
  const trackEvent = useMixpanelTrack();
  const navigate = useNavigate();
  const location = useLocation();

  const inputRef = useRef<HTMLInputElement>(null);

  const redirectToHome = () => {
    if (location.pathname !== '/') {
      navigate('/');
    }
  };

  const handleSearch = () => {
    redirectToHome();
    setKeyword(inputValue);

    inputRef.current?.blur();

    trackEvent('Search Executed', {
      inputValue: inputValue,
      page: window.location.pathname,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSearch();
  };

  return (
    <Styled.SearchBoxContainer
      isFocused={isSearchBoxClicked}
      onSubmit={handleSubmit}>
      <Styled.SearchInputStyles
        ref={inputRef}
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
        isFocused={isSearchBoxClicked}
        aria-label='검색'>
        <img src={SearchIcon} alt='Search Button' />
      </Styled.SearchButton>
    </Styled.SearchBoxContainer>
  );
};

export default SearchBox;

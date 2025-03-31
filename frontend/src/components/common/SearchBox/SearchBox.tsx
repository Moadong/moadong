import React from 'react';
import { useSearch } from '@/context/SearchContext';
import useMixpanelTrack from '@/hooks/useMixpanelTrack';
import * as Styled from './SearchBox.styles';
import SearchIcon from '@/assets/images/icons/search_button_icon.svg';
import { useNavigate } from 'react-router-dom';

const SearchBox = () => {
  const { keyword, setKeyword } = useSearch();
  const trackEvent = useMixpanelTrack();
  const navigate = useNavigate();

  const handleSearchClick = () => {
    redirectToMainIfSearchTriggeredOutside();

    if (!keyword.trim()) {
      console.log('검색어가 비어 있어 트래킹하지 않습니다.');
      return;
    }

    trackEvent('Search Executed', { keyword });
    console.log(`검색 실행: ${keyword}`);

    setKeyword(keyword);
  };

  const redirectToMainIfSearchTriggeredOutside = () => {
    if (window.location.pathname !== '/') {
      navigate('/');
    }
  };

  return (
    <Styled.SearchBoxStyles>
      <Styled.SearchInputStyles
        placeholder='어떤 동아리를 찾으세요?'
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />
      <Styled.SearchButton type='button' onClick={handleSearchClick}>
        <img src={SearchIcon} alt='Search Button' />
      </Styled.SearchButton>
    </Styled.SearchBoxStyles>
  );
};

export default SearchBox;

import React, { useState } from 'react';
import useMixpanelTrack from '@/hooks/useMixpanelTrack';
import * as Styled from './SearchBox.styles';
import SearchIcon from '@/assets/images/searchIcon.png';

const SearchBox = () => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const trackEvent = useMixpanelTrack();

  const handleSearchClick = () => {
    if (!searchKeyword.trim()) {
      console.log('검색어가 비어 있어 트래킹하지 않습니다.');
      return;
    }

    trackEvent('Search Button Clicked');

    console.log(`검색 실행: ${searchKeyword}`);
  };

  return (
    <Styled.SearchBoxStyles>
      <Styled.SearchInputStyles
        placeholder='어떤 동아리를 찾으세요?'
        onChange={(e) => setSearchKeyword(e.target.value)}
      />
      <Styled.SearchButton onClick={handleSearchClick}>
        <img src={SearchIcon} alt='Search Button' />
      </Styled.SearchButton>
    </Styled.SearchBoxStyles>
  );
};

export default SearchBox;

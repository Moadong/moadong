import { useLocation, useNavigate } from 'react-router-dom';
import SearchField from '@/components/common/SearchField/SearchField';
import { USER_EVENT } from '@/constants/eventName';
import useMixpanelTrack from '@/hooks/Mixpanel/useMixpanelTrack';
import { useSelectedCategory } from '@/store/useCategoryStore';
import { useSearchInput } from '@/store/useSearchStore';
import * as Styled from './SearchBox.styles';

const HOME_ROUTE = '/';

const SearchBox = () => {
  const { setKeyword, inputValue, setInputValue, setIsSearching } =
    useSearchInput();
  const { setSelectedCategory } = useSelectedCategory();
  const trackEvent = useMixpanelTrack();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleSearch = () => {
    if (pathname !== HOME_ROUTE) navigate(HOME_ROUTE);
    setKeyword(inputValue);
    setSelectedCategory('all');
    setIsSearching(true);

    trackEvent(USER_EVENT.SEARCH_EXCUTED, { inputValue, page: pathname });
  };

  return (
    <Styled.SearchBoxWrapper>
      <SearchField
        value={inputValue}
        onChange={(v) => setInputValue(v)}
        onSubmit={handleSearch}
        placeholder='어떤 동아리를 찾으세요?'
        ariaLabel='동아리 검색창'
      />
    </Styled.SearchBoxWrapper>
  );
};

export default SearchBox;

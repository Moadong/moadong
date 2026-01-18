import { useLocation, useNavigate } from 'react-router-dom';
import SearchField from '@/components/common/SearchField/SearchField';
import useMixpanelTrack from '@/hooks/Mixpanel/useMixpanelTrack';
import { useSelectedCategory } from '@/store/useCategoryStore';
import { useSearchInput } from '@/store/useSearchStore';

const SearchBox = () => {
  const { setKeyword, inputValue, setInputValue, setIsSearching } =
    useSearchInput();
  const { setSelectedCategory } = useSelectedCategory();
  const trackEvent = useMixpanelTrack();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectToHome = () => {
    if (location.pathname !== '/') {
      navigate('/');
    }
  };

  const handleSearch = () => {
    const currentPage = location.pathname;
    redirectToHome();
    setKeyword(inputValue);
    setSelectedCategory('all');
    setIsSearching(true);

    trackEvent('Search Executed', {
      inputValue: inputValue,
      page: currentPage,
    });
  };

  return (
    <SearchField
      value={inputValue}
      onChange={(v) => setInputValue(v)}
      onSubmit={handleSearch}
      placeholder='어떤 동아리를 찾으세요?'
      ariaLabel='동아리 검색창'
    />
  );
};

export default SearchBox;

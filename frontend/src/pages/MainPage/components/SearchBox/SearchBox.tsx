import { useSearchInput } from '@/store/useSearchStore';
import { useCategory } from '@/context/CategoryContext';
import useMixpanelTrack from '@/hooks/useMixpanelTrack';
import SearchField from '@/components/common/SearchField/SearchField';
import { useLocation, useNavigate } from 'react-router-dom';

const SearchBox = () => {
  const { setKeyword, inputValue, setInputValue, setIsSearching } =
    useSearchInput();
  const { setSelectedCategory } = useCategory();
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

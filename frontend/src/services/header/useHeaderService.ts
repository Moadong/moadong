import { useNavigate } from 'react-router-dom';
import { useSearch } from '@/context/SearchContext';
import useMixpanelTrack from '@/hooks/useMixpanelTrack';

const trackEventNames = {
  desktop: 'Home Button Clicked',
  mobile: 'Mobile Home Button Clicked',
} as const;

const useHeaderService = () => {
  const { setKeyword, setInputValue } = useSearch();
  const navigate = useNavigate();
  const trackEvent = useMixpanelTrack();

  const navigateToHome = (device: keyof typeof trackEventNames) => {
    navigate('/');
    setKeyword('');
    setInputValue('');
    trackEvent(trackEventNames[device]);
  };

  const goIntroducePage = () => {
    window.location.href =
      'https://valiant-schooner-12c.notion.site/1a64ac84bab3805287e0cef50b563370';
    trackEvent('Introduce Button Clicked');
  };

  const handleMenuClick = () => {
    trackEvent('Mobile Menu Button Clicked');
  };

  return {
    handleHomeClick: navigateToHome,
    handleIntroduceClick: goIntroducePage,
    handleMenuClick,
  };
};

export default useHeaderService;

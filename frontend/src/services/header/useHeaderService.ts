import { useNavigate } from 'react-router-dom';
import { useSearch } from '@/context/SearchContext';
import useMixpanelTrack from '@/hooks/useMixpanelTrack';
import { EVENT_NAME } from '@/constants/eventName';

const trackEventNames = {
  desktop: EVENT_NAME.HOME_BUTTON_CLICKED,
  mobile: EVENT_NAME.MOBILE_HOME_BUTTON_CLICKED,
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
    navigate('/introduce');
    trackEvent(EVENT_NAME.INTRODUCE_BUTTON_CLICKED);
  };

  const handleMenuClick = () => {
    trackEvent(EVENT_NAME.MOBILE_MENU_BUTTON_CLICKED);
  };

  return {
    handleHomeClick: navigateToHome,
    handleIntroduceClick: goIntroducePage,
    handleMenuClick,
  };
};

export default useHeaderService;

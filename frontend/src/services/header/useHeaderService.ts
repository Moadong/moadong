import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearchStore } from '@/store/useSearchStore';
import useMixpanelTrack from '@/hooks/useMixpanelTrack';
import { EVENT_NAME } from '@/constants/eventName';

const trackEventNames = {
  desktop: EVENT_NAME.HOME_BUTTON_CLICKED,
  mobile: EVENT_NAME.MOBILE_HOME_BUTTON_CLICKED,
} as const;

const useHeaderService = () => {
  const navigate = useNavigate();
  const trackEvent = useMixpanelTrack();

  const navigateToHome = useCallback(
    (device: keyof typeof trackEventNames) => {
      navigate('/');
      const { setKeyword, setInputValue } = useSearchStore.getState();
      setKeyword('');
      setInputValue('');
      trackEvent(trackEventNames[device]);
    },
    [navigate, trackEvent],
  );

  const handleIntroduceClick = useCallback(() => {
    navigate('/introduce');
    trackEvent(EVENT_NAME.INTRODUCE_BUTTON_CLICKED);
  }, [navigate, trackEvent]);

  const handleClubUnionClick = useCallback(() => {
    navigate('/club-union');
    trackEvent(EVENT_NAME.CLUB_UNION_BUTTON_CLICKED);
  }, [navigate, trackEvent]);

  const handleMenuClick = useCallback(() => {
    trackEvent(EVENT_NAME.MOBILE_MENU_BUTTON_CLICKED);
  }, [trackEvent]);

  return {
    handleHomeClick: navigateToHome,
    handleIntroduceClick,
    handleClubUnionClick,
    handleMenuClick,
  };
};

export default useHeaderService;

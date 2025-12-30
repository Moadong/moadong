import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { USER_EVENT } from '@/constants/eventName';
import useMixpanelTrack from '@/hooks/useMixpanelTrack';
import { useSearchStore } from '@/store/useSearchStore';

const useHeaderNavigation = () => {
  const navigate = useNavigate();
  const trackEvent = useMixpanelTrack();

  const handleHomeClick = useCallback(() => {
    navigate('/');
    useSearchStore.getState().resetSearch();

    trackEvent(USER_EVENT.HOME_BUTTON_CLICKED, {
      device_type: window.innerWidth <= 700 ? 'mobile' : 'desktop',
    });
  }, [navigate, trackEvent]);

  const handleIntroduceClick = useCallback(() => {
    navigate('/introduce');
    trackEvent(USER_EVENT.INTRODUCE_BUTTON_CLICKED);
  }, [navigate, trackEvent]);

  const handleClubUnionClick = useCallback(() => {
    navigate('/club-union');
    trackEvent(USER_EVENT.CLUB_UNION_BUTTON_CLICKED);
  }, [navigate, trackEvent]);

  const handlePatchNoteClick = useCallback(() => {
    window.open(
      'https://honorable-cough-8f9.notion.site/1e8aad232096804f9ea9ee4f5cf0cd10',
      '_blank',
      'noopener,noreferrer',
    );
    trackEvent(USER_EVENT.PATCH_NOTE_BUTTON_CLICKED);
  }, [trackEvent]);

  const handleAdminClick = useCallback(() => {
    navigate('/admin');
    trackEvent(USER_EVENT.ADMIN_BUTTON_CLICKED);
  }, [navigate, trackEvent]);

  return {
    handleHomeClick,
    handleIntroduceClick,
    handleClubUnionClick,
    handlePatchNoteClick,
    handleAdminClick,
  };
};

export default useHeaderNavigation;

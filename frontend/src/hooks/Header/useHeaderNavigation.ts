import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearchStore } from '@/store/useSearchStore';
import useMixpanelTrack from '@/hooks/useMixpanelTrack';
import { EVENT_NAME } from '@/constants/eventName';

const useHeaderNavigation = () => {
  const navigate = useNavigate();
  const trackEvent = useMixpanelTrack();

  const handleHomeClick = useCallback(() => {
    navigate('/');
    useSearchStore.getState().resetSearch();
    // 속성으로 관리
    trackEvent(EVENT_NAME.HOME_BUTTON_CLICKED, {
      device_type: window.innerWidth <= 700 ? 'mobile' : 'desktop',
    });
  }, [navigate, trackEvent]);

  const handleIntroduceClick = useCallback(() => {
    navigate('/introduce');
    trackEvent(EVENT_NAME.INTRODUCE_BUTTON_CLICKED);
  }, [navigate, trackEvent]);

  const handleClubUnionClick = useCallback(() => {
    navigate('/club-union');
    trackEvent(EVENT_NAME.CLUB_UNION_BUTTON_CLICKED);
  }, [navigate, trackEvent]);

  const handlePatchNoteClick = useCallback(() => {
    window.open(
      'https://honorable-cough-8f9.notion.site/1e8aad232096804f9ea9ee4f5cf0cd10',
      '_blank',
    );
    trackEvent(EVENT_NAME.PATCH_NOTE_BUTTON_CLICKED);
  }, [trackEvent]);

  return {
    handleHomeClick,
    handleIntroduceClick,
    handleClubUnionClick,
    handlePatchNoteClick,
  };
};

export default useHeaderNavigation;

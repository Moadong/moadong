import { useCallback } from 'react';
import mixpanel from 'mixpanel-browser';

const useMixpanelTrack = () => {
  const trackEvent = useCallback(
    (eventName: string, properties: Record<string, any> = {}) => {
      mixpanel.track(eventName, {
        ...properties,
        timestamp: Date.now(),
        url: window.location.href,
      });
    },
    [],
  );

  return trackEvent;
};

export default useMixpanelTrack;

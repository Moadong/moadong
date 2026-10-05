import { useCallback } from 'react';
import mixpanel from 'mixpanel-browser';
import { getEventUserArea } from './getUserArea';

const useMixpanelTrack = () => {
  const trackEvent = useCallback(
    (eventName: string, properties: Record<string, any> = {}) => {
      try {
        mixpanel.track(eventName, {
          user_area: getEventUserArea(eventName),
          ...properties,
          timestamp: Date.now(),
          url: window.location.href,
        });
      } catch (error) {
        console.warn('Failed to track event:', eventName, error);
      }
    },
    [],
  );

  return trackEvent;
};

export default useMixpanelTrack;

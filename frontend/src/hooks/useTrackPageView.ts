import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import mixpanel from 'mixpanel-browser';

const useTrackPageView = (pageName: string, clubName?: string) => {
  const location = useLocation();
  const isTracked = useRef(false);
  const startTime = useRef(Date.now());

  useEffect(() => {
    mixpanel.track(`${pageName} Visited`, {
      url: window.location.href,
      timestamp: startTime.current,
      referrer: document.referrer || 'direct',
      clubName,
    });

    const trackPageDuration = () => {
      if (isTracked.current) return;
      const duration = Date.now() - startTime.current;
      mixpanel.track(`${pageName} Duration`, {
        url: window.location.href,
        duration: duration,
        duration_seconds: Math.round(duration / 1000),
        clubName,
      });
      isTracked.current = true;
    };

    window.addEventListener('beforeunload', trackPageDuration);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        trackPageDuration();
      }
    });

    return () => {
      trackPageDuration();
      window.removeEventListener('beforeunload', trackPageDuration);
      document.removeEventListener('visibilitychange', trackPageDuration);
    };
  }, [location.pathname, clubName]);
};

export default useTrackPageView;

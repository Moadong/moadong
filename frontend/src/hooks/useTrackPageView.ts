import { useEffect, useRef } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import mixpanel from 'mixpanel-browser';

const useTrackPageView = (
  pageName: string,
  clubName?: string,
  skip: boolean = false,
) => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const isTracked = useRef(false);
  const startTime = useRef(Date.now());
  const clubNameRef = useRef(clubName);

  useEffect(() => {
    clubNameRef.current = clubName;

    if (skip) return;

    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');
    if (sessionId) {
      mixpanel.identify(sessionId);
    }

    isTracked.current = false;
    startTime.current = Date.now();

    mixpanel.track(`${pageName} Visited`, {
      url: window.location.href,
      timestamp: startTime.current,
      referrer: document.referrer || 'direct',
      clubName: clubNameRef.current,
      session_id: sessionId || undefined,
    });

    const trackPageDuration = () => {
      if (isTracked.current) return;
      isTracked.current = true;

      const duration = Date.now() - startTime.current;
      mixpanel.track(`${pageName} Duration`, {
        url: window.location.href,
        duration: duration,
        duration_seconds: Math.round(duration / 1000),
        clubName: clubNameRef.current,
        session_id: sessionId || undefined,
      });
    };

    window.addEventListener('beforeunload', trackPageDuration);

    const handleVisibilityChange = () => {
      if (document.hidden) {
        trackPageDuration();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      trackPageDuration();
      window.removeEventListener('beforeunload', trackPageDuration);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [location.pathname, clubName, skip, searchParams, pageName]);
};

export default useTrackPageView;

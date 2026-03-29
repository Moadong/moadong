import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import mixpanel from 'mixpanel-browser';

const useTrackPageView = (
  pageName: string,
  clubName?: string,
  skip: boolean = false,
  recruitmentStatus?: string,
) => {
  const location = useLocation();
  const isTracked = useRef(false);
  const startTime = useRef(Date.now());
  const clubNameRef = useRef(clubName);
  const recruitmentStatusRef = useRef(recruitmentStatus);

  useEffect(() => {
    clubNameRef.current = clubName;
    recruitmentStatusRef.current = recruitmentStatus;

    if (skip) return;

    isTracked.current = false;
    startTime.current = Date.now();

    mixpanel.track(`${pageName} Visited`, {
      url: window.location.href,
      timestamp: startTime.current,
      referrer: document.referrer || 'direct',
      clubName: clubNameRef.current,
      recruitmentStatus: recruitmentStatusRef.current,
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
        recruitmentStatus: recruitmentStatusRef.current,
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
  }, [location.pathname, clubName, skip, pageName, recruitmentStatus]);
};

export default useTrackPageView;

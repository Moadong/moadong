import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import mixpanel from 'mixpanel-browser';

const useTrackPageView = (
  pageName: string,
  clubName?: string,
  skip: boolean = false,
) => {
  const location = useLocation();
  const isTracked = useRef(false);
  const startTime = useRef(Date.now());
  const clubNameRef = useRef(clubName);


  useEffect(() => {
    clubNameRef.current = clubName;

    if (skip) return;

    isTracked.current = false;
    startTime.current = Date.now();

    mixpanel.track(`${pageName} Visited`, {
      url: window.location.href,
      timestamp: startTime.current,
      referrer: document.referrer || 'direct',
      clubName: clubNameRef.current,
    });

    const trackPageDuration = () => {
      // 레이스 컨디션 방지: 체크와 설정을 원자적으로 처리
      if (isTracked.current) return;
      isTracked.current = true;

      const duration = Date.now() - startTime.current;
      mixpanel.track(`${pageName} Duration`, {
        url: window.location.href,
        duration: duration,
        duration_seconds: Math.round(duration / 1000),
        clubName: clubNameRef.current,
      });
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
  }, [location.pathname, clubName, skip]);
};

export default useTrackPageView;

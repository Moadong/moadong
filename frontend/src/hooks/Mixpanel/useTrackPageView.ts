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

  // ref 동기화는 별도 effect에서 처리 (방문 이벤트 중복 방지)
  useEffect(() => {
    recruitmentStatusRef.current = recruitmentStatus;
  }, [recruitmentStatus]);

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
  }, [location.pathname, clubName, skip, pageName]);
};

export default useTrackPageView;

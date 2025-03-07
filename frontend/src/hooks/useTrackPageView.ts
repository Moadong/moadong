import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import mixpanel from 'mixpanel-browser';

const useTrackPageView = (pageName: string) => {
  const location = useLocation();

  useEffect(() => {
    const startTime = Date.now();

    // 페이지 방문 이벤트
    mixpanel.track(`${pageName} Visited`, {
      url: window.location.href,
      timestamp: startTime,
      referrer: document.referrer || 'direct',
    });

    const trackPageDuration = () => {
      const duration = Date.now() - startTime;
      mixpanel.track(`${pageName} Duration`, {
        url: window.location.href,
        duration: duration, // milliseconds
        duration_seconds: Math.round(duration / 1000), // Convert to seconds
      });
    };

    // 사용자가 페이지를 떠날 때 (페이지 종료 또는 새 페이지 이동)
    window.addEventListener('beforeunload', trackPageDuration);

    // 사용자가 탭을 변경하거나 백그라운드로 이동할 때
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        trackPageDuration();
      }
    });

    return () => {
      window.removeEventListener('beforeunload', trackPageDuration);
      document.removeEventListener('visibilitychange', trackPageDuration);
    };
  }, [location.pathname]);
};

export default useTrackPageView;

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import mixpanel from 'mixpanel-browser';

const useTrackPageView = (pageName: string) => {
  const location = useLocation();

  useEffect(() => {
    mixpanel.track(`${pageName} Visited`, {
      url: window.location.href,
      timestamp: Date.now(),
      referrer: document.referrer || 'direct',
    });
  }, [location.pathname]);
};

export default useTrackPageView;

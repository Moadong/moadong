import { useEffect } from 'react';
import mixpanel from 'mixpanel-browser';

const useTrackPageView = (pageName: string) => {
  useEffect(() => {
    mixpanel.track(`${pageName} Visited`, {
      url: window.location.href,
      timestamp: Date.now(),
      referrer: document.referrer || 'direct',
    });
  }, [pageName]);
};

export default useTrackPageView;

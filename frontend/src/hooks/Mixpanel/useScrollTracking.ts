import { useEffect, useRef } from 'react';
import { USER_EVENT } from '@/constants/eventName';
import useMixpanelTrack from '@/hooks/Mixpanel/useMixpanelTrack';
import getDeviceType from '@/utils/getDeviceType';

const DEPTH_MILESTONES = [25, 50, 75, 100] as const;

const useScrollTracking = (page?: string) => {
  const reached = useRef(new Set<number>());
  const trackEvent = useMixpanelTrack();

  useEffect(() => {
    reached.current = new Set<number>();

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;

      const percent = Math.round((scrollY / docHeight) * 100);

      DEPTH_MILESTONES.forEach((milestone) => {
        if (percent >= milestone && !reached.current.has(milestone)) {
          reached.current.add(milestone);
          trackEvent(USER_EVENT.SCROLL_DEPTH_REACHED, {
            depth_percent: milestone,
            scroll_y: Math.round(scrollY),
            page,
            device_type: getDeviceType(),
          });
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [page, trackEvent]);
};

export default useScrollTracking;

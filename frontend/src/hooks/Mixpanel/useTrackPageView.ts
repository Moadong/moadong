import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import mixpanel from 'mixpanel-browser';
import { PAGE_EVENT, PageViewName } from '@/constants/eventName';
import { getPageUserArea } from './getUserArea';

const trackSafely = (
  eventName: string,
  properties: Record<string, unknown>,
) => {
  try {
    mixpanel.track(eventName, properties);
  } catch (error) {
    console.warn('Failed to track page view:', eventName, error);
  }
};

interface TrackPageViewOptions {
  /** 동아리 페이지면 넣는다. 이름은 바뀌거나 겹칠 수 있어 id가 기준이다 */
  clubId?: string;
  clubName?: string;
  recruitmentStatus?: string;
  /** 데이터가 준비되기 전 등 아직 기록하지 않을 때 true */
  skip?: boolean;
}

const useTrackPageView = (
  pageName: PageViewName,
  {
    clubId,
    clubName,
    recruitmentStatus,
    skip = false,
  }: TrackPageViewOptions = {},
) => {
  const location = useLocation();
  const isTracked = useRef(false);
  const startTime = useRef(0);
  const clubIdRef = useRef(clubId);
  const clubNameRef = useRef(clubName);
  const recruitmentStatusRef = useRef(recruitmentStatus);

  // ref 동기화는 별도 effect에서 처리 (방문 이벤트 중복 방지)
  useEffect(() => {
    recruitmentStatusRef.current = recruitmentStatus;
  }, [recruitmentStatus]);

  useEffect(() => {
    clubIdRef.current = clubId;
    clubNameRef.current = clubName;

    if (skip) return;

    isTracked.current = false;
    startTime.current = Date.now();

    trackSafely(PAGE_EVENT.PAGE_VIEWED, {
      page_name: pageName,
      user_area: getPageUserArea(pageName),
      url: window.location.href,
      timestamp: startTime.current,
      referrer: document.referrer || 'direct',
      club_id: clubIdRef.current,
      club_name: clubNameRef.current,
      recruitment_status: recruitmentStatusRef.current,
    });

    const trackPageDuration = () => {
      if (isTracked.current) return;
      isTracked.current = true;

      const duration = Date.now() - startTime.current;
      trackSafely(PAGE_EVENT.PAGE_LEFT, {
        page_name: pageName,
        user_area: getPageUserArea(pageName),
        url: window.location.href,
        duration: duration,
        duration_seconds: Math.round(duration / 1000),
        club_id: clubIdRef.current,
        club_name: clubNameRef.current,
        recruitment_status: recruitmentStatusRef.current,
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
  }, [location.pathname, clubId, clubName, skip, pageName]);
};

export default useTrackPageView;

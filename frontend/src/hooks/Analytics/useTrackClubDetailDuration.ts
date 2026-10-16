import { useEffect, useRef } from 'react';
import { recordClubDetailDuration } from '@/apis/clubDetailDuration';
import {
  createAnalyticsId,
  getAnalyticsVisitorId,
} from '@/utils/analyticsVisitor';

interface UseTrackClubDetailDurationParams {
  clubId?: string;
  clubName?: string;
  skip?: boolean;
}

const MIN_DURATION_SECONDS = 1;
const MAX_DURATION_SECONDS = 3600;

const clampDurationSeconds = (durationSeconds: number) =>
  Math.min(
    MAX_DURATION_SECONDS,
    Math.max(MIN_DURATION_SECONDS, durationSeconds),
  );

const useTrackClubDetailDuration = ({
  clubId,
  clubName,
  skip = false,
}: UseTrackClubDetailDurationParams) => {
  const clubNameRef = useRef(clubName);
  const sentRef = useRef(false);
  const enteredAtMsRef = useRef(0);
  const sessionIdRef = useRef<string | undefined>(undefined);
  const visitorIdRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    clubNameRef.current = clubName;
  }, [clubName]);

  useEffect(() => {
    if (skip || !clubId) return;

    sentRef.current = false;
    enteredAtMsRef.current = Date.now();
    sessionIdRef.current = createAnalyticsId('session');
    visitorIdRef.current = getAnalyticsVisitorId();

    const enteredAt = new Date(enteredAtMsRef.current).toISOString();

    const sendDuration = () => {
      if (sentRef.current) return;
      sentRef.current = true;

      const sessionId = sessionIdRef.current;
      const visitorId = visitorIdRef.current;
      if (!sessionId || !visitorId) return;

      const leftAtMs = Date.now();
      const durationSeconds = clampDurationSeconds(
        Math.round((leftAtMs - enteredAtMsRef.current) / 1000),
      );

      void recordClubDetailDuration({
        clubId,
        clubName: clubNameRef.current,
        sessionId,
        visitorId,
        enteredAt,
        leftAt: new Date(leftAtMs).toISOString(),
        durationSeconds,
      });
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        sendDuration();
      }
    };

    window.addEventListener('pagehide', sendDuration);
    window.addEventListener('beforeunload', sendDuration);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      sendDuration();
      window.removeEventListener('pagehide', sendDuration);
      window.removeEventListener('beforeunload', sendDuration);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [clubId, skip]);
};

export default useTrackClubDetailDuration;

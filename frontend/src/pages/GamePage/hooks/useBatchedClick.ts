import { useCallback, useEffect, useRef } from 'react';
import { useClickGame } from '@/hooks/Queries/useGame';

const FLUSH_THRESHOLD = 5;
const FLUSH_DELAY = 500;

/**
 * 클릭을 모아 일정 개수(5)나 디바운스(500ms) 시점에 한 번에 전송한다.
 * 언마운트 시 미전송 클릭을 보존하기 위해 flush/clubName을 ref로 미러링한다.
 */
export const useBatchedClick = (clubName: string) => {
  const pendingRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { mutate: clickGame } = useClickGame();

  const flush = useCallback(
    (name: string) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = null;
      const count = pendingRef.current;
      if (count === 0) return;
      pendingRef.current = 0;
      clickGame({ clubName: name, count });
    },
    [clickGame],
  );

  // 언마운트 시 최신 flush/clubName으로 미전송분을 보내기 위한 ref 미러
  const flushRef = useRef(flush);
  const clubNameRef = useRef(clubName);
  useEffect(() => {
    flushRef.current = flush;
  }, [flush]);
  useEffect(() => {
    clubNameRef.current = clubName;
  }, [clubName]);

  useEffect(() => {
    return () => {
      flushRef.current(clubNameRef.current);
    };
  }, []);

  const handleClick = useCallback(() => {
    pendingRef.current += 1;

    if (pendingRef.current >= FLUSH_THRESHOLD) {
      flush(clubName);
    } else {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => flush(clubName), FLUSH_DELAY);
    }
  }, [clubName, flush]);

  return handleClick;
};

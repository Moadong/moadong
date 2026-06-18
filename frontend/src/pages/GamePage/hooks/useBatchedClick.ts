import { useCallback, useEffect, useRef } from 'react';
import { useClickGame } from '@/hooks/Queries/useGame';

const FLUSH_THRESHOLD = 5;
const FLUSH_DELAY = 500;
const MIN_CLICK_INTERVAL = 80;

/**
 * 클릭을 모아 일정 개수(5)나 디바운스(500ms) 시점에 한 번에 전송한다.
 * 언마운트 시 미전송 클릭을 보존하기 위해 flush/clubName을 ref로 미러링한다.
 */
export const useBatchedClick = (clubName: string) => {
  const pendingRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastClickTimeRef = useRef(0);
  const firstClickTimeRef = useRef<string | null>(null);
  const { mutate: clickGame } = useClickGame();

  const flush = useCallback(
    (name: string) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = null;
      const count = pendingRef.current;
      if (count === 0) return;
      const ctAt = firstClickTimeRef.current ?? new Date().toISOString();
      pendingRef.current = 0;
      firstClickTimeRef.current = null;
      clickGame(
        { clubName: name, count, ctAt },
        {
          onError: () => {
            pendingRef.current += count;
            if (firstClickTimeRef.current === null)
              firstClickTimeRef.current = ctAt;
            if (!timerRef.current) {
              timerRef.current = setTimeout(() => flush(name), FLUSH_DELAY);
            }
          },
        },
      );
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
    const now = Date.now();
    if (now - lastClickTimeRef.current < MIN_CLICK_INTERVAL) return;
    lastClickTimeRef.current = now;

    if (firstClickTimeRef.current === null) {
      firstClickTimeRef.current = new Date().toISOString();
    }

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

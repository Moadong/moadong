import { useCallback, useEffect, useRef } from 'react';
import { useClickGame } from '@/hooks/Queries/useGame';

const FLUSH_THRESHOLD = 5;
const FLUSH_DELAY = 500;
// 서버는 요청당 1~5회만 허용하고 요청이 너무 잦으면 거부하므로,
// 한 번에 최대 5회만 보내고 남은 양은 FLUSH_DELAY 간격으로 이어서 전송한다.
const MAX_CLICK_PER_REQUEST = 5;
export const CLICK_THROTTLE_MS = 100;
// UI 버튼 쓰로틀(CLICK_THROTTLE_MS)보다 짧게 잡아 버튼 핸들러를 우회하는 DOM 레벨 매크로를 차단
const MIN_CLICK_INTERVAL = Math.floor(CLICK_THROTTLE_MS * 0.8);

/**
 * 클릭을 모아 일정 개수(5)나 디바운스(500ms) 시점에 한 번에 전송한다.
 * 언마운트 시 미전송 클릭을 보존하기 위해 flush/clubName을 ref로 미러링한다.
 */
export const useBatchedClick = (clubName: string) => {
  const pendingRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastClickTimeRef = useRef(0);
  const firstClickTimeRef = useRef<string | null>(null);
  const isMountedRef = useRef(true);
  const { mutate: clickGame } = useClickGame();
  const flushRef = useRef<(name: string) => void>(() => {});

  const scheduleFlush = (name: string) => {
    // 언마운트 후에는 새 타이머를 걸지 않아 백그라운드 재전송/누수를 막는다
    if (!isMountedRef.current) return;
    if (!timerRef.current) {
      timerRef.current = setTimeout(() => flushRef.current(name), FLUSH_DELAY);
    }
  };

  const flush = useCallback(
    (name: string) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = null;
      if (pendingRef.current === 0) return;

      // 이번 요청에 보낼 양(최대 5)만 떼어내고 나머지는 다음 flush로 미룬다
      const count = Math.min(MAX_CLICK_PER_REQUEST, pendingRef.current);
      const ctAt = firstClickTimeRef.current ?? new Date().toISOString();
      pendingRef.current -= count;
      firstClickTimeRef.current = null;

      clickGame(
        { clubName: name, count, ctAt },
        {
          onError: () => {
            if (!isMountedRef.current) return;
            pendingRef.current += count;
            if (
              firstClickTimeRef.current === null ||
              ctAt < firstClickTimeRef.current
            )
              firstClickTimeRef.current = ctAt;
            scheduleFlush(name);
          },
        },
      );

      // 남은 클릭이 있으면 레이트리밋을 피해 간격을 두고 이어서 전송
      if (pendingRef.current > 0) scheduleFlush(name);
    },
    [clickGame],
  );

  // 언마운트 시 최신 flush/clubName으로 미전송분을 보내기 위한 ref 미러
  const clubNameRef = useRef(clubName);
  useEffect(() => {
    flushRef.current = flush;
  }, [flush]);
  useEffect(() => {
    clubNameRef.current = clubName;
  }, [clubName]);

  // 언마운트 cleanup 일원화: 가드를 먼저 내려 이후 scheduleFlush가 새 타이머를
  // 못 걸게 한 뒤, 남은 타이머를 정리하고 미전송분을 마지막으로 한 번 보낸다.
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = null;
      flushRef.current(clubNameRef.current);
    };
  }, []);

  // amount: 버튼 클릭은 1, 비눗방울 터치는 방울에 적힌 값만큼 한 번에 적립.
  // source: 버튼 클릭만 매크로 방지 쓰로틀을 적용한다. 비눗방울은 방울당 1회만
  // 터치 가능하므로(중복 가드 존재) 쓰로틀로 누락돼 서버 카운트와 어긋나지 않도록 우회한다.
  const handleClick = useCallback(
    (amount = 1, source: 'button' | 'bubble' = 'button') => {
      if (source === 'button') {
        const now = Date.now();
        if (now - lastClickTimeRef.current < MIN_CLICK_INTERVAL) return;
        lastClickTimeRef.current = now;
      }

      if (firstClickTimeRef.current === null) {
        firstClickTimeRef.current = new Date().toISOString();
      }

      pendingRef.current += amount;

      if (pendingRef.current >= FLUSH_THRESHOLD) {
        flush(clubName);
      } else {
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => flush(clubName), FLUSH_DELAY);
      }
    },
    [clubName, flush],
  );

  return handleClick;
};

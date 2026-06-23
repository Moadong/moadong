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
// 서버 레이트리밋(IP당 10초에 20회 초과 시 30초 밴)을 넘지 않도록 한 요청과
// 다음 요청 사이 최소 간격. 550ms면 약 18회/10초로 여유를 둔다.
// 버닝(클릭당 +2)이면 임계치에 2배 빨리 도달하는데, 이 간격이 없으면 요청
// 빈도가 2배가 되어 429로 차단된다.
const MIN_SEND_INTERVAL = 550;
// 백로그가 쌓여도 ctAt이 서버의 30초 과거 윈도우에 걸리지 않도록 하는 하한(여유 5초)
const CTAT_MAX_AGE_MS = 25_000;

/**
 * 클릭을 모아 일정 개수(5)나 디바운스(500ms) 시점에 한 번에 전송한다.
 * 언마운트 시 미전송 클릭을 보존하기 위해 flush/clubName을 ref로 미러링한다.
 */
export const useBatchedClick = (clubName: string) => {
  const pendingRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastClickTimeRef = useRef(0);
  // 마지막으로 서버에 실제 전송한 시각(레이트리밋 회피용, 버튼 쓰로틀과 별개)
  const lastSendTimeRef = useRef(0);
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
      if (pendingRef.current === 0) {
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = null;
        return;
      }

      // 직전 전송 이후 최소 간격이 지나지 않았으면, 남은 시간만큼 미뤄 레이트리밋을
      // 회피한다. 버닝으로 임계치에 빨리 도달해도 전송 빈도는 이 간격으로 고정된다.
      const now = Date.now();
      const sinceLast = now - lastSendTimeRef.current;
      if (sinceLast < MIN_SEND_INTERVAL) {
        if (!isMountedRef.current) return;
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(
          () => flushRef.current(name),
          MIN_SEND_INTERVAL - sinceLast,
        );
        return;
      }

      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = null;
      lastSendTimeRef.current = now;

      // 이번 요청에 보낼 양(최대 5)만 떼어내고 나머지는 다음 flush로 미룬다
      const count = Math.min(MAX_CLICK_PER_REQUEST, pendingRef.current);
      let ctAt = firstClickTimeRef.current ?? new Date(now).toISOString();
      // 백로그가 오래 쌓여 ctAt이 서버 30초 윈도우를 넘기면 거부되므로 하한 보정
      const minCtAt = new Date(now - CTAT_MAX_AGE_MS).toISOString();
      if (ctAt < minCtAt) ctAt = minCtAt;
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
  // 동아리가 바뀌면 이전 동아리에 쌓인 미전송 클릭을 먼저 보낸다. 그렇지 않으면
  // 다음 flush에서 이전 동아리 클릭이 새 동아리 이름으로 합산돼 오적립된다.
  useEffect(() => {
    const prevClubName = clubNameRef.current;
    if (prevClubName && prevClubName !== clubName && pendingRef.current > 0) {
      flushRef.current(prevClubName);
    }
    clubNameRef.current = clubName;
  }, [clubName]);

  // 언마운트 cleanup 일원화: 가드를 먼저 내려 이후 scheduleFlush가 새 타이머를
  // 못 걸게 한 뒤, 남은 타이머를 정리하고 미전송분을 마지막으로 한 번 보낸다.
  // lastSendTime을 0으로 되돌려 전송 간격 가드를 우회한다(마지막 1회 추가 요청은
  // 레이트리밋에 영향 없음). 버닝 백로그가 5를 넘긴 채 이탈하면 이 한 번의 flush로
  // 최대 5개만 전송되고 나머지는 유실되지만, 게임 도중 이탈하는 드문 경우라 허용한다.
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = null;
      lastSendTimeRef.current = 0;
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

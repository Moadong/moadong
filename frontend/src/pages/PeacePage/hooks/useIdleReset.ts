import { useEffect, useRef } from 'react';

const ACTIVITY_EVENTS = ['pointerdown', 'pointermove', 'keydown', 'touchstart'];

/** 부스 태블릿용. enabled일 때 ms 동안 입력이 없으면 onIdle을 한 번 부른다 */
export const useIdleReset = (
  enabled: boolean,
  ms: number,
  onIdle: () => void,
) => {
  // 최신 onIdle을 effect 안에서만 갱신한다(렌더 중 ref 쓰기 금지 규칙)
  const onIdleRef = useRef(onIdle);
  useEffect(() => {
    onIdleRef.current = onIdle;
  });

  useEffect(() => {
    if (!enabled) return undefined;
    let timer = window.setTimeout(() => onIdleRef.current(), ms);
    const restart = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => onIdleRef.current(), ms);
    };
    ACTIVITY_EVENTS.forEach((event) =>
      window.addEventListener(event, restart, { passive: true }),
    );
    return () => {
      window.clearTimeout(timer);
      ACTIVITY_EVENTS.forEach((event) =>
        window.removeEventListener(event, restart),
      );
    };
  }, [enabled, ms]);
};

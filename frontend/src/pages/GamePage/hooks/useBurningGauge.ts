import { useEffect, useRef, useState } from 'react';

const GAUGE_MAX = 100;
// 클릭당 게이지 증가량. 멈추면 감소하므로 연속 클릭해야 가득 찬다.
const CLICK_GAIN = 7;
// 클릭을 멈췄을 때 초당 감소량 (연타를 유지해야 채워지도록)
const DECAY_PER_SEC = 20;
// decay 루프 주기 (ms)
const DECAY_TICK_MS = 50;

// 버닝 이벤트 지속 시간
const BURNING_DURATION_MS = 30_000;
// 버닝 동안 클릭당 적립 배수 (+2)
export const BURNING_MULTIPLIER = 2;
// 버닝 남은 시간 갱신 주기 (ms)
const BURNING_TICK_MS = 100;

/**
 * 연속 클릭으로 게이지를 채우면 30초간 "버닝 이벤트"가 발동해 클릭당 +2씩 적립된다.
 * - 게이지는 클릭으로 차오르고, 멈추면 시간에 비례해 감소한다(연타 유도).
 * - 가득 차는 순간 버닝 시작, 30초 후 종료되며 게이지는 0으로 초기화된다.
 * - 버닝 중에는 게이지가 가득 찬 상태로 고정되고 추가 적립/감소가 멈춘다.
 */
export const useBurningGauge = () => {
  const [gauge, setGauge] = useState(0); // 0~GAUGE_MAX
  const [isBurning, setIsBurning] = useState(false);
  const [burningRemainingMs, setBurningRemainingMs] = useState(0);

  // 게이지 실제 값/타이머는 ref로 관리해 잦은 재생성 없이 루프를 돌린다
  const gaugeRef = useRef(0);
  const isBurningRef = useRef(false);
  const decayTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastDecayTickRef = useRef(0);
  const burningTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const burningEndRef = useRef(0);

  const stopDecay = () => {
    if (decayTimerRef.current) {
      clearInterval(decayTimerRef.current);
      decayTimerRef.current = null;
    }
  };

  // 게이지가 0보다 클 때만 도는 감소 루프. 0에 닿으면 스스로 멈춘다.
  const startDecay = () => {
    if (decayTimerRef.current) return;
    lastDecayTickRef.current = Date.now();
    decayTimerRef.current = setInterval(() => {
      const now = Date.now();
      const dt = (now - lastDecayTickRef.current) / 1000;
      lastDecayTickRef.current = now;
      const next = Math.max(0, gaugeRef.current - DECAY_PER_SEC * dt);
      gaugeRef.current = next;
      setGauge(next);
      if (next <= 0) stopDecay();
    }, DECAY_TICK_MS);
  };

  const endBurning = () => {
    if (burningTimerRef.current) {
      clearInterval(burningTimerRef.current);
      burningTimerRef.current = null;
    }
    isBurningRef.current = false;
    setIsBurning(false);
    setBurningRemainingMs(0);
    gaugeRef.current = 0;
    setGauge(0);
  };

  const startBurning = () => {
    stopDecay();
    gaugeRef.current = GAUGE_MAX;
    setGauge(GAUGE_MAX);
    isBurningRef.current = true;
    setIsBurning(true);
    burningEndRef.current = Date.now() + BURNING_DURATION_MS;
    setBurningRemainingMs(BURNING_DURATION_MS);
    burningTimerRef.current = setInterval(() => {
      const remain = burningEndRef.current - Date.now();
      if (remain <= 0) {
        endBurning();
      } else {
        setBurningRemainingMs(remain);
      }
    }, BURNING_TICK_MS);
  };

  // 매 버튼 클릭마다 호출. 버닝 중이면 게이지는 고정이라 무시한다.
  const registerClick = () => {
    if (isBurningRef.current) return;
    const next = Math.min(GAUGE_MAX, gaugeRef.current + CLICK_GAIN);
    gaugeRef.current = next;
    setGauge(next);
    if (next >= GAUGE_MAX) {
      startBurning();
    } else {
      startDecay();
    }
  };

  useEffect(() => {
    return () => {
      if (decayTimerRef.current) clearInterval(decayTimerRef.current);
      if (burningTimerRef.current) clearInterval(burningTimerRef.current);
    };
  }, []);

  return {
    /** 0~1 비율 (게이지 바 표시용) */
    gaugeRatio: gauge / GAUGE_MAX,
    isBurning,
    /** 버닝 남은 시간(초) */
    burningRemainingSec: Math.ceil(burningRemainingMs / 1000),
    registerClick,
  };
};

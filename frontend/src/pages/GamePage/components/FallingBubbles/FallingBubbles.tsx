import { memo, useEffect, useRef, useState } from 'react';
import * as S from './FallingBubbles.styles';

interface FallingBubblesProps {
  /** 방울을 터치해 적립한 값을 부모에 전달 */
  onCatch: (value: number) => void;
}

interface Bubble {
  id: number;
  value: number;
  size: number;
  xPct: number; // 가로 시작 위치(중심 기준 %)
  duration: number; // 낙하 시간(초)
  drift: number; // 좌우 흔들림(px)
  hue: number;
}

interface Pop {
  id: number;
  value: number;
  x: number; // 터치 지점(clientX)
  y: number; // 터치 지점(clientY)
  hue: number;
}

// 값이 클수록 크고 드물게 등장 (weight = 등장 확률)
// 서버가 요청당 클릭 수를 1~5로 제한하므로 방울 값도 5를 넘지 않는다.
const BUBBLE_TIERS = [
  { value: 2, size: 58, weight: 42 },
  { value: 3, size: 72, weight: 34 },
  { value: 5, size: 92, weight: 24 },
];
const TOTAL_WEIGHT = BUBBLE_TIERS.reduce((sum, t) => sum + t.weight, 0);

const BUBBLE_HUES = [190, 280, 330, 45, 150];
const MAX_BUBBLES = 5;
const SPAWN_MIN_MS = 1400;
const SPAWN_MAX_MS = 3000;
const POP_DURATION_MS = 900;

const pickTier = () => {
  let r = Math.random() * TOTAL_WEIGHT;
  for (const tier of BUBBLE_TIERS) {
    r -= tier.weight;
    if (r <= 0) return tier;
  }
  return BUBBLE_TIERS[0];
};

const createBubble = (id: number): Bubble => {
  const tier = pickTier();
  return {
    id,
    value: tier.value,
    size: tier.size,
    xPct: 8 + Math.random() * 80,
    duration: 6 + Math.random() * 4,
    drift: 14 + Math.random() * 26,
    hue: BUBBLE_HUES[Math.floor(Math.random() * BUBBLE_HUES.length)],
  };
};

const FallingBubbles = ({ onCatch }: FallingBubblesProps) => {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [pops, setPops] = useState<Pop[]>([]);
  const bubbleIdRef = useRef(0);
  const popIdRef = useRef(0);
  const poppedRef = useRef<Set<number>>(new Set());
  const timeoutsRef = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());

  // 랜덤 간격으로 방울을 생성 (화면에 MAX_BUBBLES 초과 시 생성 건너뜀)
  useEffect(() => {
    let active = true;
    let timeoutId: ReturnType<typeof setTimeout>;

    const scheduleNext = () => {
      const delay =
        SPAWN_MIN_MS + Math.random() * (SPAWN_MAX_MS - SPAWN_MIN_MS);
      timeoutId = setTimeout(() => {
        if (!active) return;
        setBubbles((prev) =>
          prev.length >= MAX_BUBBLES
            ? prev
            : [...prev, createBubble(bubbleIdRef.current++)],
        );
        scheduleNext();
      }, delay);
    };

    scheduleNext();
    const timeouts = timeoutsRef.current;
    return () => {
      active = false;
      clearTimeout(timeoutId);
      timeouts.forEach(clearTimeout);
    };
  }, []);

  const removeBubble = (id: number) => {
    setBubbles((prev) => prev.filter((b) => b.id !== id));
  };

  const handlePop = (bubble: Bubble, e: React.MouseEvent) => {
    // 같은 방울의 중복 터치(더블탭/오토클릭) 시 이중 적립 방지
    if (poppedRef.current.has(bubble.id)) return;
    poppedRef.current.add(bubble.id);

    onCatch(bubble.value);
    removeBubble(bubble.id);

    const popId = popIdRef.current++;
    setPops((prev) => [
      ...prev,
      {
        id: popId,
        value: bubble.value,
        x: e.clientX,
        y: e.clientY,
        hue: bubble.hue,
      },
    ]);
    const timerId = setTimeout(() => {
      setPops((prev) => prev.filter((p) => p.id !== popId));
      // 방울이 이미 언마운트된 뒤이므로 가드를 깨지 않고 메모리 정리
      poppedRef.current.delete(bubble.id);
      timeoutsRef.current.delete(timerId);
    }, POP_DURATION_MS);
    timeoutsRef.current.add(timerId);
  };

  return (
    <S.Layer>
      {bubbles.map((bubble) => (
        <S.Bubble
          key={bubble.id}
          $size={bubble.size}
          $hue={bubble.hue}
          $xPct={bubble.xPct}
          initial={{ y: '-14vh', opacity: 0 }}
          animate={{
            y: '114vh',
            x: [0, bubble.drift, -bubble.drift, bubble.drift * 0.5, 0],
            opacity: 1,
          }}
          transition={{
            duration: bubble.duration,
            ease: 'linear',
            x: { duration: bubble.duration, ease: 'easeInOut' },
            opacity: { duration: 0.5 },
          }}
          onAnimationComplete={() => removeBubble(bubble.id)}
          onClick={(e) => handlePop(bubble, e)}
        >
          <S.BubbleValue $size={bubble.size}>+{bubble.value}</S.BubbleValue>
        </S.Bubble>
      ))}

      {pops.map((pop) => (
        <S.Pop key={pop.id} $x={pop.x} $y={pop.y}>
          {/* 터치 지점에서 퍼지는 링 */}
          <S.PopRing
            $hue={pop.hue}
            initial={{ scale: 0, opacity: 0.7 }}
            animate={{ scale: 2.4, opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
          {/* 위로 떠오르는 +N */}
          <S.PopValue
            $hue={pop.hue}
            initial={{ y: 0, opacity: 0, scale: 0.6 }}
            animate={{ y: -52, opacity: [0, 1, 1, 0], scale: 1.2 }}
            transition={{ duration: POP_DURATION_MS / 1000, ease: 'easeOut' }}
          >
            +{pop.value}
          </S.PopValue>
        </S.Pop>
      ))}
    </S.Layer>
  );
};

export default memo(FallingBubbles);

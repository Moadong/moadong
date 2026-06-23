import { memo, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CLICK_THROTTLE_MS } from '../../hooks/useBatchedClick';
import * as S from './ClickButton.styles';

interface ClickButtonProps {
  clubName: string;
  onClickGame: () => void;
  onChangeClub: () => void;
  isDark?: boolean;
}

const PARTICLE_COUNT_DESKTOP = 36;
const PARTICLE_COUNT_MOBILE = 16;
// 연속 클릭 시 버스트가 무한히 겹쳐 쌓이는 것을 방지 (모바일 렉 방지)
const MAX_CONCURRENT_BURSTS = 4;

const mobileQuery =
  typeof window !== 'undefined'
    ? window.matchMedia('(max-width: 699px)')
    : null;

const PARTICLE_COLORS = [
  '#FF5414',
  '#FFD432',
  '#FF9D7C',
  '#FFFFFF',
  '#5FD8C0',
  '#7094FF',
  '#FF5FA2',
];

const Firework = ({ isMobile }: { isMobile: boolean }) => {
  const [particles] = useState(() => {
    const count = isMobile ? PARTICLE_COUNT_MOBILE : PARTICLE_COUNT_DESKTOP;
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
      const distance = 160 + Math.random() * 130;
      const size = 6 + Math.random() * 11;
      const isConfetti = Math.random() > 0.5;
      return {
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        color:
          PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
        size,
        isConfetti,
        spin: (Math.random() - 0.5) * 720,
        duration: 0.7 + Math.random() * 0.4,
      };
    });
  });

  return (
    <>
      {particles.map((p, i) => (
        <motion.span
          key={i}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1, rotate: 0 }}
          animate={{
            x: p.x,
            y: [0, p.y * 0.7, p.y + 40],
            opacity: [1, 1, 0],
            scale: 0.3,
            rotate: p.spin,
          }}
          transition={{ duration: p.duration, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: p.isConfetti ? p.size * 0.6 : p.size,
            height: p.isConfetti ? p.size * 1.6 : p.size,
            marginTop: -p.size / 2,
            marginLeft: -p.size / 2,
            borderRadius: p.isConfetti ? '2px' : '50%',
            background: p.color,
            boxShadow: isMobile ? 'none' : `0 0 8px ${p.color}`,
            pointerEvents: 'none',
          }}
        />
      ))}
    </>
  );
};

const ClickButton = ({
  clubName,
  onClickGame,
  onChangeClub,
  isDark = false,
}: ClickButtonProps) => {
  const [clickCount, setClickCount] = useState(0);
  const [bursts, setBursts] = useState<number[]>([]);
  const [isMobile, setIsMobile] = useState(mobileQuery?.matches ?? false);
  const burstIdRef = useRef(0);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const lastClickRef = useRef(0);

  useEffect(() => {
    if (!mobileQuery) return;
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mobileQuery.addEventListener('change', handler);
    return () => mobileQuery.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    return () => {
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
    };
  }, []);

  const handleClick = () => {
    const now = Date.now();
    if (now - lastClickRef.current < CLICK_THROTTLE_MS) return;
    lastClickRef.current = now;

    setClickCount((prev) => prev + 1);
    onClickGame();

    const id = burstIdRef.current++;
    // 연속 클릭 시 겹쳐 쌓이는 버스트를 최신 N개로 제한
    setBursts((prev) => {
      const next = [...prev, id];
      return next.length > MAX_CONCURRENT_BURSTS
        ? next.slice(next.length - MAX_CONCURRENT_BURSTS)
        : next;
    });
    let timer: ReturnType<typeof setTimeout>;
    timer = setTimeout(() => {
      setBursts((prev) => prev.filter((b) => b !== id));
      timersRef.current = timersRef.current.filter((t) => t !== timer);
    }, 1200);
    timersRef.current.push(timer);
  };

  return (
    <S.Wrapper>
      <S.ButtonArea onClick={handleClick}>
        {bursts.map((id) => (
          <Firework key={id} isMobile={isMobile} />
        ))}
        <S.Button
          as={motion.button}
          $clicking={false}
          onClick={handleClick}
          onKeyDown={(e) =>
            e.repeat &&
            (e.key === 'Enter' || e.key === ' ') &&
            e.preventDefault()
          }
          whileTap={{ scale: 0.88 }}
          whileHover={{ scale: 1.06 }}
          transition={{ type: 'spring', stiffness: 400, damping: 15 }}
          style={{ position: 'relative', zIndex: 1 }}
        >
          클릭!
        </S.Button>
      </S.ButtonArea>

      <S.CountWrapper>
        <AnimatePresence mode='popLayout'>
          <motion.span
            key={clickCount}
            initial={{ opacity: 0, y: -12, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            style={{ fontSize: '2rem', fontWeight: 800, color: '#FF5414' }}
          >
            {clickCount.toLocaleString()}
          </motion.span>
        </AnimatePresence>
        <S.CountLabel $dark={isDark}>회</S.CountLabel>
      </S.CountWrapper>

      <S.ClubRow>
        <S.ClubLabel $dark={isDark}>{clubName}</S.ClubLabel>
        <S.ChangeButton $dark={isDark} onClick={onChangeClub}>
          변경
        </S.ChangeButton>
      </S.ClubRow>
    </S.Wrapper>
  );
};

export default memo(ClickButton);

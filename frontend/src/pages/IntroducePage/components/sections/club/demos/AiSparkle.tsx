// 브랜드색에서 보라·파랑으로 번지는 그라데이션 별 세 개가 은은하게 숨쉬고 반짝이는 AI 표시
import { useId } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { colors } from '@/styles/theme/colors';
import * as Styled from './AiSparkle.styles';

/** 네 꼭짓점이 오목하게 빠진 별. 24×24 칸 기준 */
const STAR_PATH =
  'M12 0C12.9 6.3 17.7 11.1 24 12C17.7 12.9 12.9 17.7 12 24C11.1 17.7 6.3 12.9 0 12C6.3 11.1 11.1 6.3 12 0Z';

const STARS = [
  { x: 10, y: 22, size: 52, delay: 0 },
  { x: 58, y: 8, size: 22, delay: 0.6 },
  { x: 60, y: 54, size: 14, delay: 1.1 },
] as const;

const AiSparkle = () => {
  const gradientId = useId();
  const reduceMotion = useReducedMotion();

  return (
    <Styled.Wrap aria-hidden='true'>
      <Styled.Glow />
      <svg viewBox='0 0 84 84' width='84' height='84'>
        <defs>
          <linearGradient id={gradientId} x1='0' y1='0' x2='1' y2='1'>
            <stop offset='0%' stopColor={colors.primary[900]} />
            <stop offset='40%' stopColor={colors.secondary[1].main} />
            <stop offset='72%' stopColor={colors.secondary[6].main} />
            <stop offset='100%' stopColor={colors.secondary[4].main} />
          </linearGradient>
        </defs>
        {STARS.map(({ x, y, size, delay }) => (
          <motion.g
            key={`${x}-${y}`}
            style={{
              originX: `${x + size / 2}px`,
              originY: `${y + size / 2}px`,
            }}
            animate={
              reduceMotion
                ? undefined
                : { scale: [1, 1.12, 1], opacity: [1, 0.75, 1] }
            }
            transition={{
              duration: 2.4,
              delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <path
              d={STAR_PATH}
              fill={`url(#${gradientId})`}
              transform={`translate(${x} ${y}) scale(${size / 24})`}
            />
          </motion.g>
        ))}
      </svg>
    </Styled.Wrap>
  );
};

export default AiSparkle;

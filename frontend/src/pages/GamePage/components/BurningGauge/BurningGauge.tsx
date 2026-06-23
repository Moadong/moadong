import { memo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import * as S from './BurningGauge.styles';

interface BurningGaugeProps {
  ratio: number; // 0~1
  isBurning: boolean;
  remainingSec: number;
  isDark?: boolean;
}

const BurningGauge = ({
  ratio,
  isBurning,
  remainingSec,
  isDark = false,
}: BurningGaugeProps) => {
  return (
    <S.Wrapper>
      <S.Track $dark={isDark} $burning={isBurning}>
        <S.Fill $ratio={isBurning ? 1 : ratio} $burning={isBurning} />
      </S.Track>

      <AnimatePresence mode='wait'>
        {isBurning ? (
          <motion.div
            key='burning'
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <S.BurningBadge>
              🔥 버닝 타임! 클릭당 +2 · {remainingSec}초
            </S.BurningBadge>
          </motion.div>
        ) : (
          <motion.div
            key='idle'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <S.Label $dark={isDark}>연속 클릭하면 버닝 타임! 🔥</S.Label>
          </motion.div>
        )}
      </AnimatePresence>
    </S.Wrapper>
  );
};

export default memo(BurningGauge);

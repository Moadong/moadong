// 데모 화면 위를 움직이며 누르는 맥 화살표 커서 (누를 때 살짝 작아지고 원이 퍼진다)
import { AnimatePresence, motion } from 'framer-motion';
import { colors } from '@/styles/theme/colors';
import * as Styled from './MacCursor.styles';

export interface CursorState {
  x: number;
  y: number;
  /** 누르는 순간마다 바뀌는 값 (클릭 원 애니메이션 재생용) */
  clickId: number;
  visible: boolean;
}

interface MacCursorProps {
  cursor: CursorState;
}

const MacCursor = ({ cursor }: MacCursorProps) => {
  return (
    <Styled.Layer
      aria-hidden='true'
      initial={false}
      animate={{ x: cursor.x, y: cursor.y, opacity: cursor.visible ? 1 : 0 }}
      transition={{
        x: { type: 'spring', stiffness: 120, damping: 20, mass: 0.8 },
        y: { type: 'spring', stiffness: 120, damping: 20, mass: 0.8 },
        opacity: { duration: 0.25 },
      }}
    >
      <AnimatePresence>
        {cursor.clickId > 0 && (
          <Styled.Ripple
            key={cursor.clickId}
            initial={{ scale: 0.2, opacity: 0.55 }}
            animate={{ scale: 1.6, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        )}
      </AnimatePresence>
      <motion.svg
        key={cursor.clickId}
        viewBox='0 0 24 28'
        width='30'
        height='35'
        initial={{ scale: 0.86 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.18 }}
        style={{ transformOrigin: '3px 3px' }}
      >
        <path
          d='M3 2.5v20.2l5.4-5.2 3.4 7.9 3.6-1.5-3.4-7.8h7.4L3 2.5Z'
          fill={colors.base.black}
          stroke={colors.base.white}
          strokeWidth='1.6'
          strokeLinejoin='round'
        />
      </motion.svg>
    </Styled.Layer>
  );
};

export default MacCursor;

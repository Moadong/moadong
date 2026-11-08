// 데모 화면 위를 움직이며 누르는 맥 화살표 커서 (누를 때 살짝 작아지고 원이 퍼진다)
import { AnimatePresence } from 'framer-motion';
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
        // 튕김 없이 한 번에 감속하며 도착한다
        x: { duration: 0.65, ease: [0.4, 0, 0.2, 1] },
        y: { duration: 0.65, ease: [0.4, 0, 0.2, 1] },
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
      {/* 누를 때 커서 자체는 움직이지 않고 퍼지는 원으로만 알린다 */}
      <svg viewBox='0 0 24 28' width='30' height='35'>
        <path
          d='M3 2.5v20.2l5.4-5.2 3.4 7.9 3.6-1.5-3.4-7.8h7.4L3 2.5Z'
          fill={colors.base.black}
          stroke={colors.base.white}
          strokeWidth='1.6'
          strokeLinejoin='round'
        />
      </svg>
    </Styled.Layer>
  );
};

export default MacCursor;

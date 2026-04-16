import { AnimatePresence, motion } from 'framer-motion';
import * as S from './ClickButton.styles';

interface ClickButtonProps {
  clubName: string;
  clickCount: number;
  onClickGame: () => void;
}

const ClickButton = ({
  clubName,
  clickCount,
  onClickGame,
}: ClickButtonProps) => {
  return (
    <S.Wrapper>
      <S.ClubLabel>{clubName}</S.ClubLabel>
      <motion.button
        onClick={onClickGame}
        whileTap={{ scale: 0.88 }}
        whileHover={{ scale: 1.06 }}
        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
        style={{
          width: 180,
          height: 180,
          borderRadius: '50%',
          border: 'none',
          background: '#FF5414',
          color: '#fff',
          fontSize: '1.5rem',
          fontWeight: 700,
          cursor: 'pointer',
          boxShadow: '0 8px 24px rgba(255, 84, 20, 0.35)',
          userSelect: 'none',
        }}
      >
        클릭!
      </motion.button>

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
        <S.CountLabel>회</S.CountLabel>
      </S.CountWrapper>
    </S.Wrapper>
  );
};

export default ClickButton;

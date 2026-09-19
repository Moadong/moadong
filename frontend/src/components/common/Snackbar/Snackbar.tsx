import { useEffect, useRef } from 'react';
import Portal from '@/components/common/Portal/Portal';
import { colors } from '@/styles/theme/colors';
import * as Styled from './Snackbar.styles';

// 읽고 액션까지 눌러야 해서 토스트(3500ms)보다 길게 잡는다
const DEFAULT_DURATION = 6000;
const DEFAULT_BACKGROUND_COLOR = 'rgba(17, 17, 17, 0.85)';

interface SnackbarAction {
  label: string;
  onClick: () => void;
}

interface SnackbarProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  /** 문구 옆에 렌더할 액션. 표면이 아니라 이 버튼만 눌린다 */
  action: SnackbarAction;
  backgroundColor?: string;
  color?: string;
  duration?: number;
  /** 모바일·태블릿에서 화면 아래로부터의 거리(CSS length). 하단 고정 버튼이 있는 화면에서 겹침을 피할 때 쓴다 */
  bottomOffset?: string;
}

const Snackbar = ({
  isOpen,
  onClose,
  message,
  action,
  backgroundColor = DEFAULT_BACKGROUND_COLOR,
  color = colors.base.white,
  duration = DEFAULT_DURATION,
  bottomOffset,
}: SnackbarProps) => {
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => onCloseRef.current(), duration);
    return () => clearTimeout(timer);
  }, [isOpen, duration]);

  if (!isOpen) return null;

  return (
    <Portal>
      <Styled.SnackbarSurface
        role='status'
        $bottomOffset={bottomOffset}
        $backgroundColor={backgroundColor}
        $color={color}
        $duration={duration}
      >
        {message}
        <Styled.SnackbarActionButton type='button' onClick={action.onClick}>
          {action.label}
        </Styled.SnackbarActionButton>
      </Styled.SnackbarSurface>
    </Portal>
  );
};

export default Snackbar;

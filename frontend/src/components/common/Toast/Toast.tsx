import { useEffect, useRef } from 'react';
import { colors } from '@/styles/theme/colors';
import Portal from '../Portal/Portal';
import * as Styled from './Toast.styles';

const DEFAULT_DURATION = 3500;
const DEFAULT_BACKGROUND_COLOR = 'rgba(17, 17, 17, 0.85)';

interface ToastProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  backgroundColor?: string;
  color?: string;
  duration?: number;
  /** 모바일·태블릿에서 화면 아래로부터의 거리(CSS length). 하단 고정 버튼이 있는 화면에서 겹침을 피할 때 쓴다 */
  bottomOffset?: string;
}

const Toast = ({
  isOpen,
  onClose,
  message,
  backgroundColor = DEFAULT_BACKGROUND_COLOR,
  color = colors.base.white,
  duration = DEFAULT_DURATION,
  bottomOffset,
}: ToastProps) => {
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
      <Styled.ToastMessage
        role='status'
        $bottomOffset={bottomOffset}
        $backgroundColor={backgroundColor}
        $color={color}
        $duration={duration}
      >
        {message}
      </Styled.ToastMessage>
    </Portal>
  );
};

export default Toast;

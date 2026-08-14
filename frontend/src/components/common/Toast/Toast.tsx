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
}

const Toast = ({
  isOpen,
  onClose,
  message,
  backgroundColor = DEFAULT_BACKGROUND_COLOR,
  color = colors.base.white,
  duration = DEFAULT_DURATION,
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

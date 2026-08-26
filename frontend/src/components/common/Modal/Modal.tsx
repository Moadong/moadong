import { MouseEvent, ReactNode, useRef } from 'react';
import useBodyScrollLock from '@/hooks/useBodyScrollLock';
import useFocusTrap from '@/hooks/useFocusTrap';
import useTopmostEscape from '@/hooks/useTopmostEscape';
import Portal from '../Portal/Portal';
import * as Styled from './Modal.styles';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  closeOnBackdrop?: boolean;
}

const Modal = ({
  isOpen,
  onClose,
  children,
  closeOnBackdrop = true,
}: ModalProps) => {
  const contentRef = useRef<HTMLDivElement>(null);

  useBodyScrollLock(isOpen);
  useTopmostEscape(isOpen, onClose);
  useFocusTrap(isOpen, contentRef);

  if (!isOpen) return null;

  return (
    <Portal>
      <Styled.Overlay onClick={closeOnBackdrop ? onClose : undefined}>
        <Styled.ContentWrapper
          ref={contentRef}
          tabIndex={-1}
          onClick={(e: MouseEvent<HTMLDivElement>) => e.stopPropagation()}
        >
          {children}
        </Styled.ContentWrapper>
      </Styled.Overlay>
    </Portal>
  );
};

export default Modal;

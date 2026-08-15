import { MouseEvent, ReactNode } from 'react';
import useBodyScrollLock from '@/hooks/useBodyScrollLock';
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
  useBodyScrollLock(isOpen);
  useTopmostEscape(isOpen, onClose);

  if (!isOpen) return null;

  return (
    <Portal>
      <Styled.Overlay onClick={closeOnBackdrop ? onClose : undefined}>
        <Styled.ContentWrapper
          onClick={(e: MouseEvent<HTMLDivElement>) => e.stopPropagation()}
        >
          {children}
        </Styled.ContentWrapper>
      </Styled.Overlay>
    </Portal>
  );
};

export default Modal;

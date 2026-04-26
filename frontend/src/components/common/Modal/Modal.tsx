import { MouseEvent, ReactNode, useEffect } from 'react';
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
  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

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

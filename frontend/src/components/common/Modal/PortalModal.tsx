import { MouseEvent, ReactNode, useEffect } from 'react';
import Portal from '../Portal/Portal';
import * as Styled from './Modal.styles';

interface PortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  closeOnBackdrop?: boolean;
}

const PortalModal = ({
  isOpen,
  onClose,
  children,
  closeOnBackdrop = true,
}: PortalModalProps) => {
  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

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

export default PortalModal;

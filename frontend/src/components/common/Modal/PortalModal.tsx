import { MouseEvent, ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';
import * as Styled from './Modal.styles';

interface PortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  onBackdropClick: () => boolean | void;
}

const modalRoot = document.getElementById('modal-root') as HTMLElement;

const PortalModal = ({
  isOpen,
  onClose,
  children,
  onBackdropClick,
}: PortalModalProps) => {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <Styled.Overlay
      isOpen={isOpen}
      onClick={() => {
        const shouldClose = onBackdropClick?.();
        if (shouldClose !== false) onClose();
      }}
    >
      <Styled.Container
        isOpen={isOpen}
        onClick={(e: MouseEvent<HTMLDivElement>) => e.stopPropagation()}
      >
        {children}
      </Styled.Container>
    </Styled.Overlay>,
    modalRoot,
  );
};

export default PortalModal;

import { MouseEvent, ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';
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
    if (isOpen) document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  const modalRoot = document.getElementById('modal-root');
  if (!modalRoot) return null;

  return createPortal(
    <Styled.Overlay
      isOpen={isOpen}
      onClick={() => { if (closeOnBackdrop) onClose();}}
    >
      <Styled.ContentWrapper
        onClick={(e: MouseEvent<HTMLDivElement>) => e.stopPropagation()}
      >
        {children}
      </Styled.ContentWrapper>
    </Styled.Overlay>,
    modalRoot,
  );
};

export default PortalModal;

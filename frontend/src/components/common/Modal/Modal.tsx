import { MouseEvent, ReactNode, useEffect } from 'react';
import * as Styled from './Modal.styles';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: ReactNode;
  onBackdropClick?: () => boolean | void;
}

const Modal = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  onBackdropClick,
}: ModalProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <Styled.Overlay isOpen={isOpen} onClick={onBackdropClick} aria-modal='true'>
      <Styled.Container
        isOpen={isOpen}
        onClick={(e: MouseEvent<HTMLDivElement>) => e.stopPropagation()}
      >
        <Styled.Header>
          {title && <Styled.Title>{title}</Styled.Title>}
          <Styled.IconButton aria-label='close' type='button' onClick={onClose}>
            ✕
          </Styled.IconButton>
        </Styled.Header>
        {description && <Styled.Description>{description}</Styled.Description>}
        <Styled.Body>{children}</Styled.Body>
      </Styled.Container>
    </Styled.Overlay>
  );
};

export default Modal;

import { MouseEvent, ReactNode } from "react";
import * as Styled from './Modal.styles';
import { RemoveScroll } from "react-remove-scroll";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: ReactNode;
  onBackdropClick?: () => boolean | void;
}

const Modal = ({ isOpen, onClose, title, description, children, onBackdropClick }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <Styled.Overlay isOpen={isOpen} onClick={onBackdropClick} aria-modal="true">
      <RemoveScroll enabled={isOpen}>
      <Styled.Container isOpen={isOpen} onClick={(e: MouseEvent<HTMLDivElement>) => e.stopPropagation()}>
        <Styled.Header> 
            {title && <Styled.Title>{title}</Styled.Title>}
          <Styled.IconButton aria-label="close" type="button" onClick={onClose}>✕</Styled.IconButton>
        </Styled.Header>
        {description && <Styled.Description>{description}</Styled.Description>}
        <Styled.Body>{children}</Styled.Body>
      </Styled.Container>
      </RemoveScroll>
    </Styled.Overlay>
  );
}

export default Modal;
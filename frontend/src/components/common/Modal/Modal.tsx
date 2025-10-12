import { ReactNode} from "react";
import * as Styled from './Modal.styles';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: ReactNode;
}

const Modal = ({ isOpen, onClose, title, description, children }: ModalProps) => {
    if (!isOpen) return null;

   return (
    <Styled.Overlay isOpen={isOpen} onClick={onClose} aria-modal="true">
      <Styled.Container isOpen={isOpen} onClick={(event) => event.stopPropagation()}>
        <Styled.Header> 
            {title && <Styled.Title>{title}</Styled.Title>}
          <Styled.IconButton aria-label="close" type="button" onClick={onClose}>✕</Styled.IconButton>
        </Styled.Header>
        {description && <Styled.Description>{description}</Styled.Description>}
        <Styled.Body>{children}</Styled.Body>
      </Styled.Container>
    </Styled.Overlay>
  );
}

export default Modal;
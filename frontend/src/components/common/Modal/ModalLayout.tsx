import { ReactNode } from 'react';
import * as Styled from './Modal.styles';

interface ModalLayoutProps {
  onClose?: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
}

const ModalLayout = ({
  onClose,
  title,
  description,
  children,
}: ModalLayoutProps) => {
  return (
    <>
      {(title || onClose) && (
        <Styled.Header>
          {title && <Styled.Title>{title}</Styled.Title>}
          <Styled.IconButton aria-label='close' type='button' onClick={onClose}>
            ✕
          </Styled.IconButton>
        </Styled.Header>
      )}
      {description && <Styled.Description>{description}</Styled.Description>}
      <Styled.Body>{children}</Styled.Body>
    </>
  );
};

export default ModalLayout;

import { ReactNode } from 'react';
import * as Styled from './Modal.styles';

interface ModalLayoutProps {
  onClose?: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  width?: string;
}

const ModalLayout = ({
  onClose,
  title,
  description,
  children,
  width,
}: ModalLayoutProps) => {
  return (
    <Styled.StandardLayout 
      $width={width} 
      role="dialog" 
      aria-modal="true"
      >
      {(title || onClose) && (
        <Styled.Header>
          {title && <Styled.Title>{title}</Styled.Title>}
          {onClose && (
            <Styled.IconButton 
                aria-label='close' 
                type='button' 
                onClick={onClose}
            >
                ✕
            </Styled.IconButton>
          )}
        </Styled.Header>
      )}
      {description && <Styled.Description>{description}</Styled.Description>}
      <Styled.Body>{children}</Styled.Body>
    </Styled.StandardLayout>
  );
};

export default ModalLayout;

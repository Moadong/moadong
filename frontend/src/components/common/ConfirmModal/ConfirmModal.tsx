import { useId } from 'react';
import ModalCheckIcon from '@/assets/images/icons/modal_check.svg?react';
import ModalWarningIcon from '@/assets/images/icons/modal_warning.svg?react';
import Modal from '@/components/common/Modal/Modal';
import * as Styled from './ConfirmModal.styles';

export interface ConfirmModalAction {
  label: string;
  variant: 'primary' | 'secondary';
  onClick: () => void;
}

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  actions: ConfirmModalAction[];
  variant?: 'warning' | 'check';
}

const ConfirmModal = ({
  isOpen,
  onClose,
  title,
  description,
  actions,
  variant = 'warning',
}: ConfirmModalProps) => {
  const id = useId();
  const titleId = `${id}-title`;
  const descriptionId = `${id}-description`;

  return (
    <Modal isOpen={isOpen} onClose={onClose} closeOnBackdrop={false}>
      <Styled.Dialog
        role='dialog'
        aria-modal='true'
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
      >
        <Styled.Body>
          {variant === 'check' ? (
            <ModalCheckIcon width={24} height={24} aria-hidden />
          ) : (
            <ModalWarningIcon width={24} height={24} aria-hidden />
          )}
          <Styled.Title id={titleId}>{title}</Styled.Title>
          <Styled.Description id={descriptionId}>
            {description}
          </Styled.Description>
        </Styled.Body>
        <Styled.Footer>
          {actions.map((action) => (
            <Styled.FooterButton
              key={action.label}
              type='button'
              $variant={action.variant}
              onClick={action.onClick}
            >
              {action.label}
            </Styled.FooterButton>
          ))}
        </Styled.Footer>
      </Styled.Dialog>
    </Modal>
  );
};

export default ConfirmModal;

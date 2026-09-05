import { useId } from 'react';
import ModalWarningIcon from '@/assets/images/icons/modal_warning.svg?react';
import ModalCheckIcon from '@/assets/images/icons/modal_check.svg?react';
import Modal from '@/components/common/Modal/Modal';
import * as Styled from './ConfirmModal.styles';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel: string;
  variant?: 'warning' | 'check';
}

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel,
  variant = 'warning',
}: ConfirmModalProps) => {
  const id = useId();
  const titleId = `${id}-title`;
  const descriptionId = `${id}-description`;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
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
          <Styled.FooterButton type='button' onClick={onClose}>
            취소
          </Styled.FooterButton>
          <Styled.FooterButton type='button' $emphasized onClick={onConfirm}>
            {confirmLabel}
          </Styled.FooterButton>
        </Styled.Footer>
      </Styled.Dialog>
    </Modal>
  );
};

export default ConfirmModal;

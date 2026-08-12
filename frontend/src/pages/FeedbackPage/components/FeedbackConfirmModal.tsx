import WarningIcon from '@/assets/images/icons/feedback/feedback_warning.svg?react';
import Modal from '@/components/common/Modal/Modal';
import * as Styled from './FeedbackConfirmModal.styles';

interface FeedbackConfirmModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  onConfirm: () => void;
  onClose: () => void;
}

const FeedbackConfirmModal = ({
  isOpen,
  title,
  description,
  confirmLabel,
  onConfirm,
  onClose,
}: FeedbackConfirmModalProps) => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <Styled.Dialog role='dialog' aria-modal='true'>
      <Styled.Body>
        <WarningIcon width={24} height={24} aria-hidden />
        <Styled.Title>{title}</Styled.Title>
        <Styled.Description>{description}</Styled.Description>
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

export default FeedbackConfirmModal;

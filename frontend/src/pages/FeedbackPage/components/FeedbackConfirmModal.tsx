import { useId } from 'react';
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
}: FeedbackConfirmModalProps) => {
  // 작성 화면은 나가기·전송 모달을 함께 들고 있어서 id가 겹치면 안 된다
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
          <WarningIcon width={24} height={24} aria-hidden />
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

export default FeedbackConfirmModal;

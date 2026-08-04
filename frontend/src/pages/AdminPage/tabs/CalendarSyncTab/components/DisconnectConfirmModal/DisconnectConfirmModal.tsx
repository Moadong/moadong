import WarningIcon from '@/assets/images/icons/calendar_sync_warning.svg?react';
import Modal from '@/components/common/Modal/Modal';
import * as Styled from './DisconnectConfirmModal.styles';

interface DisconnectConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DisconnectConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
}: DisconnectConfirmModalProps) => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <Styled.Card role='dialog' aria-modal='true'>
      <Styled.Message>
        <Styled.Icon aria-hidden>
          <WarningIcon />
        </Styled.Icon>
        <Styled.Title>연동을 해제할까요?</Styled.Title>
        <Styled.Description>
          가져온 일정은 캘린더에서 사라집니다.
        </Styled.Description>
      </Styled.Message>
      <Styled.Actions>
        <Styled.CancelButton type='button' onClick={onClose}>
          취소
        </Styled.CancelButton>
        <Styled.ConfirmButton type='button' onClick={onConfirm}>
          확인
        </Styled.ConfirmButton>
      </Styled.Actions>
    </Styled.Card>
  </Modal>
);

export default DisconnectConfirmModal;

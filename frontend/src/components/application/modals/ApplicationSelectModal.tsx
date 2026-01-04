import { ApplicationForm } from '@/types/application';
import * as Styled from './ApplicationSelectModal.styles';
import PortalModal from '@/components/common/Modal/PortalModal';
import ModalLayout from '@/components/common/Modal/ModalLayout';

export interface ApplicationSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  options: ApplicationForm[];
  onSelect: (option: ApplicationForm) => void;
}

interface OptionsListProps {
  options: ApplicationForm[];
  onSelect: (option: ApplicationForm) => void;
}

const OptionsList = ({ options, onSelect }: OptionsListProps) => {
  if (options.length === 0) {
    return (
      <Styled.EmptyMessage>지원 가능한 분야가 없습니다.</Styled.EmptyMessage>
    );
  }

  return (
    <Styled.List>
      {options.map((option) => (
        <Styled.OptionButton
          key={option.id}
          onClick={() => {
            onSelect(option);
          }}
        >
          {option.title}
        </Styled.OptionButton>
      ))}
    </Styled.List>
  );
};

const ApplicationSelectModal = ({
  isOpen,
  onClose,
  options,
  onSelect,
}: ApplicationSelectModalProps) => {
  return (
    <PortalModal
      isOpen={isOpen}
      onClose={onClose}
      onBackdropClick={() => true}
    >
      <ModalLayout title='지원서 선택' onClose={onClose}>
        <OptionsList options={options} onSelect={onSelect} />
      </ModalLayout>
    </PortalModal>
  );
};

export default ApplicationSelectModal;

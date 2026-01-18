import ModalLayout from '@/components/common/Modal/ModalLayout';
import PortalModal from '@/components/common/Modal/PortalModal';
import { ApplicationForm } from '@/types/application';
import * as Styled from './ApplicationSelectModal.styles';

export interface ApplicationSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicationOptions: ApplicationForm[];
  onOptionSelect: (application: ApplicationForm) => void;
}

interface ApplicationOptionsProps {
  applicationOptions: ApplicationForm[];
  onOptionSelect: (application: ApplicationForm) => void;
}

const ApplicationOptions = ({
  applicationOptions,
  onOptionSelect,
}: ApplicationOptionsProps) => {
  if (applicationOptions.length === 0) {
    return (
      <Styled.EmptyMessage>지원 가능한 분야가 없습니다.</Styled.EmptyMessage>
    );
  }

  return (
    <Styled.List>
      {applicationOptions.map((application) => (
        <Styled.OptionButton
          key={application.id}
          onClick={() => {
            onOptionSelect(application);
          }}
        >
          {application.title}
        </Styled.OptionButton>
      ))}
    </Styled.List>
  );
};

const ApplicationSelectModal = ({
  isOpen,
  onClose,
  applicationOptions,
  onOptionSelect,
}: ApplicationSelectModalProps) => {
  return (
    <PortalModal isOpen={isOpen} onClose={onClose} closeOnBackdrop={true}>
      <ModalLayout title='지원서 선택' onClose={onClose} width='500px'>
        <ApplicationOptions
          applicationOptions={applicationOptions}
          onOptionSelect={onOptionSelect}
        />
      </ModalLayout>
    </PortalModal>
  );
};

export default ApplicationSelectModal;

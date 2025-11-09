import Modal from "@/components/common/Modal/Modal";
import * as Styled from './ApplicationSelectModal.styles';
import { ApplicationForm } from "@/types/application";

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
        return <Styled.EmptyMessage>지원 가능한 분야가 없습니다.</Styled.EmptyMessage>;
    }

    return (
        <Styled.List>
            {options.map((option) => (
                <Styled.OptionButton key={option.id} onClick={() => {onSelect(option);}}>
                    {option.title}
                </Styled.OptionButton>
            ))}
        </Styled.List>
    )
};

const ApplicationSelectModal = ({ isOpen, onClose, options, onSelect }: ApplicationSelectModalProps) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="지원 분야 선택"
            description="지원할 분야를 선택해주세요"
            onBackdropClick={() => {return false;}}
        >
            <OptionsList options={options} onSelect={onSelect} />
        </Modal>
    );
};

export default ApplicationSelectModal;

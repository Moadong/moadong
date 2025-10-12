import Modal from "@/components/common/Modal/Modal";
import * as Styled from './ApplicationSelectModal.styles';
import { ApplicationOption } from "@/types/application";

export interface ApplicationSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  options: ApplicationOption[];
  onSelect: (option: ApplicationOption) => void;
}

const ApplicationSelectModal = ({ isOpen, onClose, options, onSelect }: ApplicationSelectModalProps) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="지원 분야 선택"
            description="지원할 분야를 선택해주세요"
        >
            {options.length === 0 ? (
                <Styled.EmptyMessage>지원 가능한 분야가 없습니다.</Styled.EmptyMessage>
            ) : (
            <Styled.List>
                {options.map((option) => (
                    <Styled.OptionButton key={option.id} onClick={() => onSelect(option)}>
                        {option.name}
                    </Styled.OptionButton>
                ))}
            </Styled.List>
            )}
        </Modal>
    );
};

export default ApplicationSelectModal;

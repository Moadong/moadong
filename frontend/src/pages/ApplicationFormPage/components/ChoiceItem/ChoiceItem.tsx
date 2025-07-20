import * as Styled from './ChoiceItem.styles';

interface ChoiceItemProps {
    label: string;
    selected: boolean;
    onClick: () => void;
}

const ChoiceItem = ({ label, selected, onClick }: ChoiceItemProps) => {
    return (
        <Styled.ItemWrapper onClick={onClick} data-selected={selected ? 'true' : undefined}>
            <Styled.Label>{label || '(빈 항목)'}</Styled.Label>
        </Styled.ItemWrapper>
    );
};

export default ChoiceItem;

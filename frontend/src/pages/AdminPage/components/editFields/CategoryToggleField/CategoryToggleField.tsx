import EditCard from '../EditCard/EditCard';
import * as Styled from './CategoryToggleField.styles';

interface CategoryToggleFieldProps {
  label: string;
  options: string[];
  value: string;
  onSelect: (option: string) => void;
}

const CategoryToggleField = ({
  label,
  options,
  value,
  onSelect,
}: CategoryToggleFieldProps) => {
  return (
    <EditCard label={label}>
      <Styled.OptionsRow>
        {options.map((option) => (
          <Styled.OptionButton
            key={option}
            type='button'
            $category={option}
            $selected={value === option}
            onClick={() => onSelect(option)}
          >
            {option}
          </Styled.OptionButton>
        ))}
      </Styled.OptionsRow>
    </EditCard>
  );
};

export default CategoryToggleField;

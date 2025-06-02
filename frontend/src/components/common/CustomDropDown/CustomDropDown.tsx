import { useState } from 'react';
import * as Styled from './CustomDropDown.styles';
import dropdown_icon from '@/assets/images/icons/drop_button_icon.svg';

interface DropdownOption {
  label: string;
  value: string;
}

interface DropdownProps {
  options: DropdownOption[];
  selected: string;
  onSelect: (value: string) => void;
}

const CustomDropdown = ({ options, selected, onSelect }: DropdownProps) => {
  const [open, setOpen] = useState(false);

  const handleSelect = (value: string) => {
    onSelect(value);
    setOpen(false);
  };

  const selectedLabel =
    options.find((option) => option.value === selected)?.label || '선택하세요';

  return (
    <Styled.DropDownWrapper>
      <Styled.Selected onClick={() => setOpen((prev) => !prev)} open={open}>
        <span>{selectedLabel}</span>
        <Styled.Icon src={dropdown_icon} alt='드롭다운 버튼' />
      </Styled.Selected>
      {open && (
        <Styled.OptionList>
          {options.map(({ label, value }) => (
            <Styled.OptionItem
              key={value}
              isSelected={value === selected}
              onClick={() => handleSelect(value)}
            >
              {label}
            </Styled.OptionItem>
          ))}
        </Styled.OptionList>
      )}
    </Styled.DropDownWrapper>
  );
};

export default CustomDropdown;

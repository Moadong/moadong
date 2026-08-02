import { useState } from 'react';
import { CustomDropDown } from '@/components/common/CustomDropDown/CustomDropDown';
import * as Styled from './SortDropdown.styles';

export type SortValue = 'date' | 'name';

const SORT_OPTIONS = [
  { value: 'date' as const, label: '제출순' },
  { value: 'name' as const, label: '이름순' },
] as const;

interface SortDropdownProps {
  value: SortValue;
  onChange: (value: SortValue) => void;
}

const SortDropdown = ({ value, onChange }: SortDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedLabel = SORT_OPTIONS.find((o) => o.value === value)?.label ?? '제출순';

  return (
    <Styled.Wrapper>
      <CustomDropDown
        options={SORT_OPTIONS}
        selected={value}
        onSelect={(v) => {
          onChange(v);
          setIsOpen(false);
        }}
        open={isOpen}
        onToggle={() => setIsOpen((prev) => !prev)}
      >
        <CustomDropDown.Trigger>
          <Styled.Trigger>
            <Styled.Label>{selectedLabel}</Styled.Label>
            <Styled.Chevron $isOpen={isOpen} />
          </Styled.Trigger>
        </CustomDropDown.Trigger>
        <CustomDropDown.Menu right='0' width='100px'>
          {SORT_OPTIONS.map(({ value: v, label }) => (
            <CustomDropDown.Item key={v} value={v}>
              {label}
            </CustomDropDown.Item>
          ))}
        </CustomDropDown.Menu>
      </CustomDropDown>
    </Styled.Wrapper>
  );
};

export default SortDropdown;

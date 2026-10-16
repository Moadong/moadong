import { CustomDropDown } from '@/components/common/CustomDropDown/CustomDropDown';
import * as Styled from './SortDropdown.styles';

export type SortValue = 'date' | 'name';

const SORT_OPTIONS = [
  { value: 'date', label: '제출순' },
  { value: 'name', label: '이름순' },
] as const;

interface SortDropdownProps {
  value: SortValue;
  onChange: (value: SortValue) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const SortDropdown = ({
  value,
  onChange,
  isOpen,
  onToggle,
}: SortDropdownProps) => {
  const selectedLabel =
    SORT_OPTIONS.find((o) => o.value === value)?.label ?? '제출순';

  return (
    <Styled.Wrapper>
      <CustomDropDown
        options={SORT_OPTIONS}
        selected={value}
        onSelect={(v) => onChange(v as SortValue)}
        open={isOpen}
        onToggle={onToggle}
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

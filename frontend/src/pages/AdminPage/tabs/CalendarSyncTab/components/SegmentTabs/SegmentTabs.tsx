import type { CustomEventType } from '@/types/club';
import * as Styled from './SegmentTabs.styles';

const TAB_OPTIONS: { value: CustomEventType; label: string }[] = [
  { value: 'SINGLE', label: '일반' },
  { value: 'PERIOD', label: '기간' },
  { value: 'RECURRING', label: '반복' },
  { value: 'MULTI', label: '다중' },
];

interface SegmentTabsProps {
  value: CustomEventType;
  onChange: (value: CustomEventType) => void;
}

const SegmentTabs = ({ value, onChange }: SegmentTabsProps) => (
  <Styled.Container role='tablist'>
    {TAB_OPTIONS.map((option) => (
      <Styled.Tab
        key={option.value}
        type='button'
        role='tab'
        aria-selected={value === option.value}
        $active={value === option.value}
        onClick={() => onChange(option.value)}
      >
        {option.label}
      </Styled.Tab>
    ))}
  </Styled.Container>
);

export default SegmentTabs;

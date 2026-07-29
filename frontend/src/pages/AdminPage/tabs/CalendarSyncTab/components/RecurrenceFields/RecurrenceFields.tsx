import { useEffect, useRef, useState } from 'react';
import type { RecurrenceFrequency } from '@/types/club';
import {
  formatKoreanDateWithWeekday,
  WEEKDAY_LABELS,
} from '@/utils/calendarSyncUtils';
import * as Styled from './RecurrenceFields.styles';

const FREQUENCY_OPTIONS: { value: RecurrenceFrequency; label: string }[] = [
  { value: 'WEEKLY', label: '매주' },
  { value: 'MONTHLY', label: '매월' },
  { value: 'YEARLY', label: '매년' },
];

export const frequencyLabel = (frequency: RecurrenceFrequency) =>
  FREQUENCY_OPTIONS.find((option) => option.value === frequency)?.label ?? '';

interface RecurrenceFieldsProps {
  frequency: RecurrenceFrequency;
  onFrequencyChange: (frequency: RecurrenceFrequency) => void;
  /** 매주 반복 시 선택 요일 (0=일 ~ 6=토) */
  weekdays: number[];
  onToggleWeekday: (weekday: number) => void;
  /** 각 행을 눌러 시트에서 정하는 반복 기간 */
  startDate: string;
  endDate: string | null;
  onOpenStartPicker: () => void;
  onOpenEndPicker: () => void;
}

const RecurrenceFields = ({
  frequency,
  onFrequencyChange,
  weekdays,
  onToggleWeekday,
  startDate,
  endDate,
  onOpenStartPicker,
  onOpenEndPicker,
}: RecurrenceFieldsProps) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isDropdownOpen) return;
    const handleOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [isDropdownOpen]);

  const selectFrequency = (next: RecurrenceFrequency) => {
    onFrequencyChange(next);
    setDropdownOpen(false);
  };

  return (
    <Styled.Container>
      <Styled.Row>
        <Styled.RowLabel>반복 유형</Styled.RowLabel>
        <Styled.DropdownAnchor ref={dropdownRef}>
          <Styled.RowValueButton
            type='button'
            aria-expanded={isDropdownOpen}
            onClick={() => setDropdownOpen((prev) => !prev)}
          >
            {frequencyLabel(frequency)}
            <Styled.Chevron $open={isDropdownOpen}>▼</Styled.Chevron>
          </Styled.RowValueButton>
          {isDropdownOpen && (
            <Styled.DropdownList role='listbox'>
              {FREQUENCY_OPTIONS.map((option) => (
                <Styled.DropdownItem
                  key={option.value}
                  role='option'
                  tabIndex={0}
                  aria-selected={option.value === frequency}
                  $active={option.value === frequency}
                  onClick={() => selectFrequency(option.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      selectFrequency(option.value);
                    }
                  }}
                >
                  {option.label}
                </Styled.DropdownItem>
              ))}
            </Styled.DropdownList>
          )}
        </Styled.DropdownAnchor>
      </Styled.Row>

      {frequency === 'WEEKLY' && (
        <Styled.WeekdayChipRow>
          {WEEKDAY_LABELS.map((label, index) => {
            // Figma 순서: 월~일
            const weekday = (index + 1) % 7;
            return (
              <Styled.WeekdayChip
                key={label}
                type='button'
                aria-pressed={weekdays.includes(weekday)}
                $active={weekdays.includes(weekday)}
                onClick={() => onToggleWeekday(weekday)}
              >
                {WEEKDAY_LABELS[weekday]}
              </Styled.WeekdayChip>
            );
          })}
        </Styled.WeekdayChipRow>
      )}

      <Styled.Row>
        <Styled.RowLabel>시작 날짜</Styled.RowLabel>
        <Styled.RowValueButton type='button' onClick={onOpenStartPicker}>
          {formatKoreanDateWithWeekday(startDate)}
          <Styled.Chevron>▼</Styled.Chevron>
        </Styled.RowValueButton>
      </Styled.Row>

      <Styled.Row>
        <Styled.RowLabel>종료 날짜</Styled.RowLabel>
        <Styled.RowValueButton type='button' onClick={onOpenEndPicker}>
          {formatKoreanDateWithWeekday(endDate)}
          <Styled.Chevron>▼</Styled.Chevron>
        </Styled.RowValueButton>
      </Styled.Row>
    </Styled.Container>
  );
};

export default RecurrenceFields;

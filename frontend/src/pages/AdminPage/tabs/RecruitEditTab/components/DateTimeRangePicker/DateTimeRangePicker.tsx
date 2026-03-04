import { useEffect, useRef, useState } from 'react';
import { formatRecruitmentDateTime } from '@/utils/recruitmentDateFormatter';
import DateTimePanel from './DateTimePanel';
import * as Styled from './DateTimeRangePicker.styles';

type PickerType = 'start' | 'end';

interface DateTimeRangePickerProps {
  recruitmentStart: Date | null;
  recruitmentEnd: Date | null;
  onChangeRecruitmentStart: (date: Date | null) => void;
  onChangeRecruitmentEnd: (date: Date | null) => void;
  disabledEnd?: boolean;
}

const DateTimeRangePicker = ({
  recruitmentStart,
  recruitmentEnd,
  onChangeRecruitmentStart,
  onChangeRecruitmentEnd,
  disabledEnd = false,
}: DateTimeRangePickerProps) => {
  const [activePicker, setActivePicker] = useState<PickerType | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const togglePicker = (type: PickerType) => {
    setActivePicker((current) => (current === type ? null : type));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const isOutSideClick =
        containerRef.current &&
        !containerRef.current.contains(event.target as Node);
      if (isOutSideClick) {
        setActivePicker(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!disabledEnd) return;

    setActivePicker((currentPicker) => {
      const isEndPickerActive = currentPicker === 'end';
      return isEndPickerActive ? null : currentPicker;
    });
  }, [disabledEnd]);

  return (
    <Styled.Container ref={containerRef}>
      {/* 모집 시작 기간 */}
      <Styled.Input
        $isActive={activePicker === 'start'}
        onClick={() => togglePicker('start')}
      >
        {formatRecruitmentDateTime(recruitmentStart) || '모집 시작'}
      </Styled.Input>

      <Styled.Tilde>~</Styled.Tilde>

      {/* 모집 마감 기간 */}
      <Styled.Input
        disabled={disabledEnd}
        $isActive={activePicker === 'end'}
        onClick={() => !disabledEnd && togglePicker('end')}
      >
        {formatRecruitmentDateTime(recruitmentEnd) || '모집 종료'}
      </Styled.Input>

      {activePicker && (
        <DateTimePanel
          $alignRight={activePicker === 'end'}
          date={activePicker === 'start' ? recruitmentStart : recruitmentEnd}
          onChangeDate={
            activePicker === 'start'
              ? onChangeRecruitmentStart
              : onChangeRecruitmentEnd
          }
        />
      )}
    </Styled.Container>
  );
};

export default DateTimeRangePicker;

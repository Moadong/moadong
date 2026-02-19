import { useEffect, useRef, useState } from 'react';
import * as Styled from './DateTimeRangePicker.styles';
import DateTimePanel from './DateTimePanel';
import { formatRecruitmentDateTime } from '@/utils/recruitmentDateFormatter';

type OpenTarget = 'start' | 'end' | null;

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
  const [openTarget, setOpenTarget] = useState<OpenTarget>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpenTarget(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <Styled.Container ref={containerRef}>
      {/* 모집 시작 기간 */}
      <Styled.Input
        $active={openTarget === 'start'}
        onClick={() => setOpenTarget('start')}
      >
        {formatRecruitmentDateTime(recruitmentStart) || '모집 시작'}
      </Styled.Input>

      <Styled.Tilde>~</Styled.Tilde>

      {/* 모집 마감 기간 */}
      <Styled.Input
        disabled={disabledEnd}
        $active={openTarget === 'end'}
        onClick={() => !disabledEnd && setOpenTarget('end')}
      >
        {formatRecruitmentDateTime(recruitmentEnd) || '모집 종료'}
      </Styled.Input>

      {openTarget && (
        <DateTimePanel
          date={openTarget === 'start' ? recruitmentStart : recruitmentEnd}
          onChangeDate={
            openTarget === 'start'
              ? onChangeRecruitmentStart
              : onChangeRecruitmentEnd
          }
        />
      )}
    </Styled.Container>
  );
};

export default DateTimeRangePicker;

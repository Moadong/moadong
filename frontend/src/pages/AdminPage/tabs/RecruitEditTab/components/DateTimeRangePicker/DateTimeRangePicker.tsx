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
  /** 폼 전체 비활성화. 두 입력을 잠그고 열린 패널을 닫는다 */
  disabled?: boolean;
}

const DateTimeRangePicker = ({
  recruitmentStart,
  recruitmentEnd,
  onChangeRecruitmentStart,
  onChangeRecruitmentEnd,
  disabledEnd = false,
  disabled = false,
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

  // 잠길 때 activePicker를 안 지우면, disabled가 풀리는 순간 열려 있던 패널이 혼자 다시 열린다
  useEffect(() => {
    if (disabled) setActivePicker(null);
  }, [disabled]);

  // effect가 반영되기 전의 한 프레임에도 패널이 보이지 않도록 파생값으로 한 번 더 막는다
  const visiblePicker = disabled ? null : activePicker;

  return (
    <Styled.Container ref={containerRef}>
      {/* 모집 시작 기간 */}
      <Styled.Input
        disabled={disabled}
        $isActive={visiblePicker === 'start'}
        onClick={() => !disabled && togglePicker('start')}
      >
        {formatRecruitmentDateTime(recruitmentStart) || '모집 시작'}
      </Styled.Input>

      <Styled.Tilde>~</Styled.Tilde>

      {/* 모집 마감 기간 */}
      <Styled.Input
        disabled={disabled || disabledEnd}
        $isActive={visiblePicker === 'end'}
        onClick={() => !disabled && !disabledEnd && togglePicker('end')}
      >
        {formatRecruitmentDateTime(recruitmentEnd) || '모집 종료'}
      </Styled.Input>

      {visiblePicker && (
        <DateTimePanel
          $alignRight={visiblePicker === 'end'}
          date={visiblePicker === 'start' ? recruitmentStart : recruitmentEnd}
          onChangeDate={
            visiblePicker === 'start'
              ? onChangeRecruitmentStart
              : onChangeRecruitmentEnd
          }
        />
      )}
    </Styled.Container>
  );
};

export default DateTimeRangePicker;

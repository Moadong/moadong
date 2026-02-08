import { useEffect, useRef, useState } from 'react';
import { format, set } from 'date-fns';
import RecruitmentDatePicker from './RecruitmentDatePicker';
import RecruitmentTimePicker from './RecruitmentTimePicker';
import * as Styled from './RecruitmentPeriodPicker.styles';
import { ko } from 'date-fns/locale';

type OpenPanel = 'date' | 'hour' | 'minute' | null;

interface Props {
  value: Date;
  onChange: (date: Date) => void;
}

const composeDate = (date: Date, hour: number, minute: number) => {
  const d = new Date(date);
  d.setHours(hour);
  d.setMinutes(minute);
  d.setSeconds(0);
  return d;
};

const RecruitmentPeriodPicker = ({ value, onChange }: Props) => {
  const [date, setDate] = useState(value);
  const [hour, setHour] = useState(value.getHours());
  const [minute, setMinute] = useState(value.getMinutes());
  const [openPanel, setOpenPanel] = useState<OpenPanel>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    onChange(composeDate(date, hour, minute));
  }, [date, hour, minute]);

  useEffect(() => {
    if (!openPanel) return;
    const handleClickOutside = (event: MouseEvent) => {
        if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
            setOpenPanel(null);
        }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openPanel]);
  return (
    <Styled.Wrapper ref={wrapperRef}>
      <Styled.Pill
        $active={openPanel === 'date'}
        $padding="6px 12px"
        onClick={() => setOpenPanel('date')}
      >
        {format(date, 'yyyy년 MM월 dd일 (eee)', { locale: ko })}
      </Styled.Pill>

      <Styled.Pill
        $active={openPanel === 'hour'}
        $padding="6px 8px"
        onClick={() => setOpenPanel('hour')}
      >
        {hour.toString().padStart(2, '0')}
      </Styled.Pill>

      <Styled.Colon>:</Styled.Colon>

      <Styled.Pill
        $active={openPanel === 'minute'}
        $padding="6px 8px"
        onClick={() => setOpenPanel('minute')}
      >
        {minute.toString().padStart(2, '0')}
      </Styled.Pill>

      {openPanel === 'date' && (
        <Styled.Panel $panel="date">
          <RecruitmentDatePicker
            date={date}
            onChange={(d) => {
              setDate(d);
              setOpenPanel(null);
            }}
          />
        </Styled.Panel>
      )}

      {(openPanel === 'hour' || openPanel === 'minute') && (
        <Styled.Panel $panel={openPanel}>
          <RecruitmentTimePicker
            mode={openPanel}
            hour={hour}
            minute={minute}
            onHourChange={(h) => {
              setHour(h);
              setOpenPanel(null);
            }}
            onMinuteChange={(m) => {
              setMinute(m);
              setOpenPanel(null);
            }}
          />
        </Styled.Panel>
      )}
    </Styled.Wrapper>
  );
};

export default RecruitmentPeriodPicker;

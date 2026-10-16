import type { FestivalDay } from '../../data/buskingDays';
import * as Styled from './DayArrowsNav.styles';

interface DayArrowsNavProps {
  days: FestivalDay[];
  activeDayId: string;
  onChange: (dayId: string) => void;
}

const DayArrowsNav = ({ days, activeDayId, onChange }: DayArrowsNavProps) => {
  const currentIndex = days.findIndex((d) => d.id === activeDayId);
  const activeDay = currentIndex !== -1 ? days[currentIndex] : days[0];

  if (!activeDay) return null;

  const safeIndex = currentIndex !== -1 ? currentIndex : 0;

  return (
    <Styled.Container>
      <Styled.ArrowButton
        type='button'
        onClick={() => onChange(days[safeIndex - 1].id)}
        disabled={safeIndex === 0}
        aria-label='이전 날'
      >
        ‹
      </Styled.ArrowButton>
      <Styled.DayLabel>{activeDay.fullDateLabel}</Styled.DayLabel>
      <Styled.ArrowButton
        type='button'
        onClick={() => onChange(days[safeIndex + 1].id)}
        disabled={safeIndex === days.length - 1}
        aria-label='다음 날'
      >
        ›
      </Styled.ArrowButton>
    </Styled.Container>
  );
};

export default DayArrowsNav;

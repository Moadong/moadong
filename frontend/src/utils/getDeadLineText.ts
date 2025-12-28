import { format, differenceInCalendarDays, isAfter, isBefore } from 'date-fns';
import { ko } from 'date-fns/locale';

const getDeadlineText = (
  recruitmentStart: Date | null,
  recruitmentEnd: Date | null,
  today: Date = new Date(),
): string => {
  if (!recruitmentStart || !recruitmentEnd) return '모집 마감';
  if (isBefore(today, recruitmentStart)) {
    const openDate = format(recruitmentStart, 'M월 d일 H시', { locale: ko });
    return `${openDate} 모집 예정`;
  } 
  if (isAfter(today, recruitmentEnd)) return '모집 마감';

  const days = differenceInCalendarDays(recruitmentEnd, today);

  if (days > 365) return '상시 모집';
  return days > 0 ? `D-${days}` : 'D-Day';
};

export default getDeadlineText;

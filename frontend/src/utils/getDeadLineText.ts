import { isAfter, isBefore, differenceInCalendarDays } from 'date-fns';

const getDeadlineText = (
  recruitmentStart: Date | null,
  recruitmentEnd: Date | null,
  today: Date = new Date(),
): string => {
  if (!recruitmentStart || !recruitmentEnd) return '모집 마감';
  if (isBefore(today, recruitmentStart)) return '모집 전';
  if (isAfter(today, recruitmentEnd)) return '모집 마감';

  const days = differenceInCalendarDays(recruitmentEnd, today);

  if (days > 365) return '상시 모집';
  return days > 0 ? `D-${days}` : 'D-Day';
};

export default getDeadlineText;

import { format, differenceInCalendarDays, isAfter, isBefore } from 'date-fns';
import { ko } from 'date-fns/locale';

const getDeadlineText = (
  recruitmentStart: Date | null,
  recruitmentEnd: Date | null,
  today: Date = new Date(),
): string => {
  if (!recruitmentStart || !recruitmentEnd) return '모집 마감';
  if (isBefore(today, recruitmentStart)) {
    const hour = recruitmentStart.getHours();
    const minute = recruitmentStart.getMinutes();

    let formatStr = 'M월 d일';
    if (hour !== 0) formatStr = 'M월 d일 H시';
    if (minute !== 0) formatStr = 'M월 d일 H시 m분';

    return `${format(recruitmentStart, formatStr, { locale: ko })} 모집 시작`;
  } 
  if (isAfter(today, recruitmentEnd)) return '모집 마감';

  const days = differenceInCalendarDays(recruitmentEnd, today);

  if (days > 365) return '상시 모집';
  return days > 0 ? `D-${days}` : 'D-Day';
};

export default getDeadlineText;

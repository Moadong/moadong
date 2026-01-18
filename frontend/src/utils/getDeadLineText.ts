import { differenceInCalendarDays, format } from 'date-fns';
import { ko } from 'date-fns/locale';

const RECRUITMENT_STATUS = {
  CLOSED: '모집 마감',
  ALWAYS: '상시 모집',
  UPCOMING: '모집 시작',
};

const getDeadlineText = (
  recruitmentStart: Date | null,
  recruitmentEnd: Date | null,
  recruitmentStatus: string,
  today: Date = new Date(),
): string => {
  if (recruitmentStatus === 'CLOSED') {
    return RECRUITMENT_STATUS.CLOSED;
  }

  if (recruitmentStatus === 'UPCOMING') {
    if (!recruitmentStart) return RECRUITMENT_STATUS.CLOSED;
    const hour = recruitmentStart.getHours();
    const minute = recruitmentStart.getMinutes();

    let formatStr = hour === 0 && minute === 0 ? 'M월 d일' : 'M월 d일 HH:mm';
    return `${format(recruitmentStart, formatStr, { locale: ko })} ${RECRUITMENT_STATUS.UPCOMING}`;
  }

  if (!recruitmentEnd) return RECRUITMENT_STATUS.CLOSED;
  const days = differenceInCalendarDays(recruitmentEnd, today);

  if (days > 365) return RECRUITMENT_STATUS.ALWAYS; // D-day가 의미 없을 정도로 긴 경우 '상시 모집'으로 표시
  return days > 0 ? `D-${days}` : 'D-Day';
};

export default getDeadlineText;

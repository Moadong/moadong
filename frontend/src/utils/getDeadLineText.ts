import { format, differenceInCalendarDays } from 'date-fns';
import { ko } from 'date-fns/locale';

const getDeadlineText = (
  recruitmentStart: Date | null,
  recruitmentEnd: Date | null,
  recruitmentStatus: string,
  today: Date = new Date(),
): string => {
  console.log(recruitmentStart, recruitmentEnd, recruitmentStatus, today);
  // 모집 마감
  if (recruitmentStatus === 'CLOSED') {
    return '모집 마감';
  }

  // 모집 전
  if (recruitmentStatus === 'UPCOMING') {
    if (!recruitmentStart) return '모집 마감';
    const hour = recruitmentStart.getHours();
    const minute = recruitmentStart.getMinutes();

    let formatStr = 
    hour === 0 && minute === 0 
    ? 'M월 d일'
    : 'M월 d일 HH:mm';
    return `${format(recruitmentStart, formatStr, { locale: ko })} 모집 시작`;
  }

  // 모집 중 또는 상시 모집
  if (!recruitmentEnd) return '모집 마감';
  const days = differenceInCalendarDays(recruitmentEnd, today);

  if (days > 365) return '상시 모집'; // D-day가 의미 없을 정도로 긴 경우 '상시 모집'으로 표시  
  return days > 0 ? `D-${days}` : 'D-Day';
};

export default getDeadlineText;

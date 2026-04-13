import { format, isToday } from 'date-fns';
import { ko } from 'date-fns/locale';

/**
 * 날짜를 오늘/과거 기준으로 다르게 포맷팅
 * - 오늘: 시간 형식 (예: 오후 2:30)
 * - 과거: 날짜 형식 (예: 2024.01.15)
 */
export const formatRelativeDateTime = (dateTimeString: string): string => {
  const date = new Date(dateTimeString);

  if (isToday(date)) {
    return format(date, 'aa h:mm', { locale: ko });
  }

  return format(date, 'yyyy.MM.dd', { locale: ko });
};

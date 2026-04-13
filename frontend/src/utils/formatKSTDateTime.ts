import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { toZonedTime } from 'date-fns-tz';

export const formatKSTDateTime = (
  dateStr: string,
  options: Intl.DateTimeFormatOptions = {},
) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return '';

  const zonedDate = toZonedTime(date, 'Asia/Seoul');

  let formatString = '';
  if (options.month === 'long' && options.day === 'numeric' && options.weekday === 'long') {
    formatString = 'MMMM d일 (EEEE)';
  } else if (
    options.month === 'long' &&
    options.day === 'numeric' &&
    options.weekday === 'short' &&
    options.hour === '2-digit' &&
    options.minute === '2-digit'
  ) {
    formatString = 'MMMM d일 (E) a h:mm';
  } else if (options.hour === '2-digit' && options.minute === '2-digit') {
    formatString = 'a h:mm';
  } else if (options.year === 'numeric' && options.month === '2-digit' && options.day === '2-digit') {
    formatString = 'yyyy.MM.dd';
  } else {
    // Default format if no specific options match
    formatString = 'yyyy.MM.dd a h:mm';
  }

  return format(zonedDate, formatString, { locale: ko });
};

export const formatKSTDate = (dateStr: string) =>
  formatKSTDateTime(dateStr, {
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });

export const formatKSTDateTimeFull = (dateStr: string) =>
  formatKSTDateTime(dateStr, {
    month: 'long',
    day: 'numeric',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });

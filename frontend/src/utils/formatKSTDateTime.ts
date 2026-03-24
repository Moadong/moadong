export const formatKSTDateTime = (
  dateStr: string,
  options: Intl.DateTimeFormatOptions = {}
) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);

  const formatter = new Intl.DateTimeFormat('ko-KR', {
    timeZone: 'Asia/Seoul',
    ...options,
  });
  return formatter.format(date);
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
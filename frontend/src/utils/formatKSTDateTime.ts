export const formatKSTDateTime = (
  dateStr: string,
  options: Intl.DateTimeFormatOptions = {},
) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return '';

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

/** "2025. 7. 1 오후 12:46" 형식으로 반환 */
export const formatApplicationEditedAt = (dateStr: string): string => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return '';

  const kst = new Date(
    date.toLocaleString('en-US', { timeZone: 'Asia/Seoul' }),
  );
  const year = kst.getFullYear();
  const month = kst.getMonth() + 1;
  const day = kst.getDate();
  const hours = kst.getHours();
  const minutes = kst.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? '오후' : '오전';
  const displayHours = hours % 12 || 12;

  return `${year}. ${month}. ${day} ${ampm} ${displayHours}:${minutes}`;
};

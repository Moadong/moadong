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

const kstDayKey = (dateStr: string) =>
  formatKSTDateTime(dateStr, {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  });

/**
 * 카드처럼 폭이 좁은 곳에서 쓰는 기간 표기.
 * 하루짜리면 "11월 29일 일요일", 여러 날이면 요일을 빼고 "11월 29일 ~ 11월 30일".
 */
export const formatKSTDateRange = (startStr: string, endStr: string) => {
  if (!startStr) return '';
  // 종료일이 비었거나 파싱되지 않으면 하루짜리로 본다. 안 그러면 "11월 29일 ~ "로 끝난다
  const endKey = kstDayKey(endStr);
  if (!endKey || endKey === kstDayKey(startStr)) return formatKSTDate(startStr);

  const short = (dateStr: string) =>
    formatKSTDateTime(dateStr, { month: 'long', day: 'numeric' });
  return `${short(startStr)} ~ ${short(endStr)}`;
};

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

/**
 * 날짜를 오늘/과거 기준으로 다르게 포맷팅
 * - 오늘: 시간 형식 (예: 오후 2:30)
 * - 과거: 날짜 형식 (예: 2024.01.15)
 */
export const formatRelativeDateTime = (dateTimeString: string): string => {
  const now = new Date();
  const date = new Date(dateTimeString);
  const isToday =
    now.getFullYear() === date.getFullYear() &&
    now.getMonth() === date.getMonth() &&
    now.getDate() === date.getDate();

  const options: Intl.DateTimeFormatOptions = isToday
    ? { hour: 'numeric', minute: '2-digit', hour12: true }
    : { year: 'numeric', month: '2-digit', day: '2-digit' };

  return date.toLocaleString('ko-KR', options);
};

export const formatNumber = (value: number) =>
  new Intl.NumberFormat('ko-KR').format(value);

export const formatDuration = (seconds: number) => {
  if (seconds < 60) return `${seconds}초`;
  const minutes = Math.floor(seconds / 60);
  const restSeconds = seconds % 60;
  return `${minutes}분 ${restSeconds}초`;
};

export const formatChartDate = (dateKey: string) => {
  const [, month, day] = dateKey.split('-');
  return `${month}.${day}`;
};

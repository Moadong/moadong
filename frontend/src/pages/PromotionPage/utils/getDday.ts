export const getDDay = (startDate: string, endDate: string) => {
  const today = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  today.setHours(0, 0, 0, 0);
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  if (today >= start && today <= end) {
    return 0;
  }

  if (today < start) {
    const diff = Math.ceil(
      (start.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
    );
    return diff;
  }

  return -1;
};
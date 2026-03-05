export const getDDay = (startDate: string) => {
  const today = new Date();
  const start = new Date(startDate);

  today.setHours(0, 0, 0, 0);
  start.setHours(0, 0, 0, 0);

  const diff = Math.ceil(
    (start.getTime() - today.getTime()) /
      (1000 * 60 * 60 * 24)
  );

  return diff;
};
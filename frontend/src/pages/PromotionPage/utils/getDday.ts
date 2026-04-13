export const getDDay = (eventStartDate: string, eventEndDate: string) => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const startDate = new Date(eventStartDate);
  startDate.setHours(0, 0, 0, 0);

  const endDate = new Date(eventEndDate);
  endDate.setHours(0, 0, 0, 0);

  const currentTime = now.getTime();
  const eventStartTime = startDate.getTime();
  const eventEndTime = endDate.getTime();

  if (currentTime < eventStartTime) {
    const remainingTimeUntilStart = eventStartTime - currentTime;

    const remainingDays = Math.ceil(
      remainingTimeUntilStart / (1000 * 60 * 60 * 24),
    );

    return remainingDays;
  }

  if (currentTime >= eventStartTime && currentTime <= eventEndTime) {
    return 0;
  }

  return -1;
};

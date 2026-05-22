export const getDDay = (eventStartDate: string, eventEndDate: string) => {
  const currentTime = new Date().getTime();
  const eventStartTime = new Date(eventStartDate).getTime();
  const eventEndTime = new Date(eventEndDate).getTime();

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

export const formatRecruitmentDateTime = (date?: Date | null): string => {
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  const targetDate = date ?? new Date();

  const year = targetDate.getFullYear();
  const month = String(targetDate.getMonth() + 1).padStart(2, '0');
  const day = String(targetDate.getDate()).padStart(2, '0');
  const dayName = days[targetDate.getDay()];
  const hours = String(targetDate.getHours()).padStart(2, '0');
  const minutes = String(targetDate.getMinutes()).padStart(2, '0');

  return `${year}년 ${month}월 ${day}일 (${dayName}) ${hours}:${minutes}`;
};

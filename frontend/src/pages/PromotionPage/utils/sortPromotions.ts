import { PromotionArticle } from '@/types/promotion';

const stripTime = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();

export const sortPromotions = (
  articles: PromotionArticle[],
  now: number = Date.now(),
) => {
  const today = stripTime(new Date(now));

  return [...articles].sort((a, b) => {
    const aStart = stripTime(new Date(a.eventStartDate));
    const aEnd = stripTime(new Date(a.eventEndDate));
    const bStart = stripTime(new Date(b.eventStartDate));
    const bEnd = stripTime(new Date(b.eventEndDate));

    const getStatusWeight = (start: number, end: number) => {
      if (start <= today && end >= today) return 1; // 진행 중
      if (start > today) return 2; // 예정
      return 3; // 종료
    };

    const aStatusWeight = getStatusWeight(aStart, aEnd);
    const bStatusWeight = getStatusWeight(bStart, bEnd);

    if (aStatusWeight !== bStatusWeight) return aStatusWeight - bStatusWeight;
    if (aStatusWeight === 2) return aStart - bStart;
    if (aStatusWeight === 3) return bStart - aStart;
    return aStart - bStart;
  });
};

import { PromotionArticle } from '@/types/promotion';

export const getLatestPromotionTime = (
  articles: PromotionArticle[],
): number => {
  if (!articles || articles.length === 0) return 0;

  const timestamps = articles.map((article) => {
    if (article.id && article.id.length === 24) {
      const timestamp = parseInt(article.id.substring(0, 8), 16) * 1000;
      if (!isNaN(timestamp)) return timestamp;
    }

    return new Date(article.eventStartDate).getTime();
  });

  return Math.max(...timestamps);
};

export const getLastCheckedTime = (): number | null => {
  const value = localStorage.getItem('promotion_last_checked_time');
  if (!value || value === '0') return null;
  return Number(value);
};

export const setLastCheckedTime = (time: number): void => {
  localStorage.setItem('promotion_last_checked_time', String(time));
};

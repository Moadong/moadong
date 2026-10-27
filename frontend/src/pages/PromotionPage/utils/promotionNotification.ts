import { PromotionArticle } from '@/types/promotion';

const OBJECT_ID_PATTERN = /^[0-9a-f]{24}$/i;

/** MongoDB ObjectId의 앞 8자리(초 단위 타임스탬프)에서 생성 시각을 뽑는다. ObjectId가 아니면 null (festivalMock 등) */
const getCreatedTimeFromId = (id: string | undefined): number | null => {
  if (!id || !OBJECT_ID_PATTERN.test(id)) return null;
  return parseInt(id.substring(0, 8), 16) * 1000;
};

export const getLatestPromotionTime = (
  articles: PromotionArticle[],
): number => {
  if (!articles || articles.length === 0) return 0;

  const timestamps = articles
    .map((article) => getCreatedTimeFromId(article.id))
    .filter((time): time is number => time !== null);

  return timestamps.length > 0 ? Math.max(...timestamps) : 0;
};

/** lastChecked 이후(초과)에 새로 생성된 서버 글 수. ObjectId가 아닌 글은 세지 않는다 */
export const countNewPromotions = (
  articles: PromotionArticle[],
  lastChecked: number,
): number => {
  if (!articles) return 0;

  return articles.filter((article) => {
    const createdTime = getCreatedTimeFromId(article.id);
    return createdTime !== null && createdTime > lastChecked;
  }).length;
};

export const getLastCheckedTime = (): number | null => {
  const value = localStorage.getItem('promotion_last_checked_time');
  if (!value || value === '0') return null;
  return Number(value);
};

export const setLastCheckedTime = (time: number): void => {
  localStorage.setItem('promotion_last_checked_time', String(time));
};

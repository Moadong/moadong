import {
  countNewPromotions,
  getLastCheckedTime,
  getLatestPromotionTime,
  setLastCheckedTime,
} from '@/pages/PromotionPage/utils/promotionNotification';
import { PromotionArticle } from '@/types/promotion';

describe('promotionNotification 유틸 함수 테스트', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('getLatestPromotionTime 함수', () => {
    it('빈 배열일 경우 0을 반환해야 한다', () => {
      expect(getLatestPromotionTime([])).toBe(0);
    });

    it('ObjectId가 아닌 ID(목업)는 eventStartDate가 있어도 무시하고 0을 반환해야 한다', () => {
      const mockArticles = [
        { id: 'club-fest-2026', eventStartDate: '2099-03-19T00:00:00.000Z' },
        { id: 'short-id', eventStartDate: '2026-03-19T00:00:00.000Z' },
      ] as PromotionArticle[];

      expect(getLatestPromotionTime(mockArticles)).toBe(0);
    });

    it('목업이 섞여 있어도 서버 글의 생성 시각만 최신값으로 쓴다', () => {
      const mockArticles = [
        { id: 'club-fest-2026', eventStartDate: '2099-03-19T00:00:00.000Z' },
        {
          id: '600000000000000000000000',
          eventStartDate: '2021-01-01T00:00:00Z',
        },
      ] as PromotionArticle[];

      expect(getLatestPromotionTime(mockArticles)).toBe(
        parseInt('60000000', 16) * 1000,
      );
    });

    it('여러 개의 글 중 가장 최근 시간을 반환해야 한다', () => {
      const mockArticles = [
        {
          id: '600000000000000000000000',
          eventStartDate: '2021-01-01T00:00:00Z',
        },
        {
          id: '650000000000000000000000',
          eventStartDate: '2023-01-01T00:00:00Z',
        },
      ] as PromotionArticle[];

      const time1 = parseInt('60000000', 16) * 1000;
      const time2 = parseInt('65000000', 16) * 1000;

      expect(getLatestPromotionTime(mockArticles)).toBe(Math.max(time1, time2));
    });
  });

  describe('countNewPromotions 함수', () => {
    const OLD_ID = '600000000000000000000000';
    const NEW_ID = '650000000000000000000000';
    const NEWER_ID = '660000000000000000000000';
    const lastChecked = parseInt('60000000', 16) * 1000;

    it('빈 배열이면 0을 반환해야 한다', () => {
      expect(countNewPromotions([], lastChecked)).toBe(0);
    });

    it('lastChecked보다 나중에 생성된 글만 센다', () => {
      const articles = [
        { id: OLD_ID },
        { id: NEW_ID },
        { id: NEWER_ID },
      ] as PromotionArticle[];

      expect(countNewPromotions(articles, lastChecked)).toBe(2);
    });

    it('생성 시각이 lastChecked와 같은 글은 세지 않는다 (strictly greater)', () => {
      const articles = [{ id: OLD_ID }] as PromotionArticle[];

      expect(countNewPromotions(articles, lastChecked)).toBe(0);
      expect(countNewPromotions(articles, lastChecked - 1)).toBe(1);
    });

    it('ObjectId가 아닌 목업 글은 eventStartDate가 미래여도 세지 않는다', () => {
      const articles = [
        { id: 'club-fest-2026', eventStartDate: '2099-03-19T00:00:00.000Z' },
        { id: NEW_ID },
      ] as PromotionArticle[];

      expect(countNewPromotions(articles, lastChecked)).toBe(1);
    });

    it('24자여도 16진수가 아니면 세지 않는다', () => {
      const articles = [
        { id: 'zzzzzzzzzzzzzzzzzzzzzzzz' },
      ] as PromotionArticle[];

      expect(countNewPromotions(articles, 0)).toBe(0);
    });
  });

  describe('LocalStorage 관리 함수', () => {
    test('데이터가 없으면 null을 반환해야 한다 (첫 방문 케이스)', () => {
      expect(getLastCheckedTime()).toBeNull();
    });

    test('저장된 값이 "0"이면 null을 반환해야 한다', () => {
      localStorage.setItem('promotion_last_checked_time', '0');
      expect(getLastCheckedTime()).toBeNull();
    });

    test('시간을 저장하고 다시 불러올 수 있어야 한다', () => {
      const testTime = 1710892800000;
      setLastCheckedTime(testTime);
      expect(getLastCheckedTime()).toBe(testTime);
    });
  });
});

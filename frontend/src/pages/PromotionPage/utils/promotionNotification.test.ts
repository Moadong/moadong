import { PromotionArticle } from '@/types/promotion';
import {
  getLastCheckedTime,
  getLatestPromotionTime,
  setLastCheckedTime,
} from '@/pages/PromotionPage/utils/promotionNotification';

describe('promotionNotification 유틸 함수 테스트', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('getLatestPromotionTime 함수', () => {
    it('빈 배열일 경우 0을 반환해야 한다', () => {
      expect(getLatestPromotionTime([])).toBe(0);
    });

    it('ID가 유효하지 않으면 eventStartDate를 기준으로 시간을 반환해야 한다', () => {
      const dateStr = '2026-03-19T00:00:00.000Z';
      const mockArticles = [
        { id: 'short-id', eventStartDate: dateStr },
      ] as PromotionArticle[];

      expect(getLatestPromotionTime(mockArticles)).toBe(
        new Date(dateStr).getTime(),
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

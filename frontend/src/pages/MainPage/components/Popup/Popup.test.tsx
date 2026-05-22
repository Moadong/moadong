import { DAYS_TO_HIDE, isPopupHidden, PopupConfig } from '@/utils/popupUtils';

const mockConfig: PopupConfig = {
  id: 'test_popup',
  storageKey: 'test_popup_hidden_date',
  sessionKey: 'test_popup_closed',
  image: '',
  imageAlt: '',
};

describe('Popup 유틸 함수 테스트', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  describe('isPopupHidden', () => {
    it('저장된 날짜가 없으면 false를 반환한다', () => {
      expect(isPopupHidden(mockConfig)).toBe(false);
    });

    it('7일 미만이면 true를 반환한다 (1일 전)', () => {
      const oneDayAgo = Date.now() - 1 * 24 * 60 * 60 * 1000;
      localStorage.setItem(mockConfig.storageKey, oneDayAgo.toString());

      expect(isPopupHidden(mockConfig)).toBe(true);
    });

    it('7일 미만이면 true를 반환한다 (6일 전)', () => {
      const sixDaysAgo = Date.now() - 6 * 24 * 60 * 60 * 1000;
      localStorage.setItem(mockConfig.storageKey, sixDaysAgo.toString());

      expect(isPopupHidden(mockConfig)).toBe(true);
    });

    it('정확히 7일이면 false를 반환한다', () => {
      const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
      localStorage.setItem(mockConfig.storageKey, sevenDaysAgo.toString());

      expect(isPopupHidden(mockConfig)).toBe(false);
    });

    it('7일 이상이면 false를 반환한다 (8일 전)', () => {
      const eightDaysAgo = Date.now() - 8 * 24 * 60 * 60 * 1000;
      localStorage.setItem(mockConfig.storageKey, eightDaysAgo.toString());

      expect(isPopupHidden(mockConfig)).toBe(false);
    });

    it('7일 이상이면 false를 반환한다 (30일 전)', () => {
      const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
      localStorage.setItem(mockConfig.storageKey, thirtyDaysAgo.toString());

      expect(isPopupHidden(mockConfig)).toBe(false);
    });

    it('방금 저장한 경우 true를 반환한다', () => {
      localStorage.setItem(mockConfig.storageKey, Date.now().toString());

      expect(isPopupHidden(mockConfig)).toBe(true);
    });

    it('잘못된 형식의 날짜는 NaN으로 처리되어 false를 반환한다', () => {
      localStorage.setItem(mockConfig.storageKey, 'invalid_date');

      expect(isPopupHidden(mockConfig)).toBe(false);
    });

    it('daysToHide가 0이면 "다시 보지 않기" 후에도 항상 표시된다', () => {
      const alwaysShowConfig: PopupConfig = {
        ...mockConfig,
        daysToHide: 0,
      };
      localStorage.setItem(alwaysShowConfig.storageKey, Date.now().toString());

      expect(isPopupHidden(alwaysShowConfig)).toBe(false);
    });

    it('sessionStorage에 닫힘 상태가 있으면 true를 반환한다', () => {
      sessionStorage.setItem(mockConfig.sessionKey, 'true');

      expect(isPopupHidden(mockConfig)).toBe(true);
    });
  });

  describe('DAYS_TO_HIDE 상수', () => {
    it('7일로 설정되어 있다', () => {
      expect(DAYS_TO_HIDE).toBe(7);
    });
  });

  describe('통합 시나리오', () => {
    it('시나리오: 첫 방문 → 다시 보지 않기 → 6일 후 방문 → 7일 후 방문', () => {
      // 1. 첫 방문
      expect(isPopupHidden(mockConfig)).toBe(false);

      // 2. "다시 보지 않기" 클릭
      localStorage.setItem(mockConfig.storageKey, Date.now().toString());
      expect(isPopupHidden(mockConfig)).toBe(true);

      // 3. 6일 후 방문 (아직 숨김)
      const sixDaysAgo = Date.now() - 6 * 24 * 60 * 60 * 1000;
      localStorage.setItem(mockConfig.storageKey, sixDaysAgo.toString());
      expect(isPopupHidden(mockConfig)).toBe(true);

      // 4. 7일 후 방문 (다시 표시)
      const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
      localStorage.setItem(mockConfig.storageKey, sevenDaysAgo.toString());
      expect(isPopupHidden(mockConfig)).toBe(false);
    });
  });
});

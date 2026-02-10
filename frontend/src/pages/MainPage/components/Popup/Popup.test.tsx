import {
  DAYS_TO_HIDE,
  isPopupHidden,
  POPUP_STORAGE_KEY,
} from './Popup';

describe('Popup 유틸 함수 테스트', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('isPopupHidden', () => {
    it('저장된 날짜가 없으면 false를 반환한다', () => {
      expect(isPopupHidden()).toBe(false);
    });

    it('7일 미만이면 true를 반환한다 (1일 전)', () => {
      const oneDayAgo = Date.now() - 1 * 24 * 60 * 60 * 1000;
      localStorage.setItem(POPUP_STORAGE_KEY, oneDayAgo.toString());

      expect(isPopupHidden()).toBe(true);
    });

    it('7일 미만이면 true를 반환한다 (6일 전)', () => {
      const sixDaysAgo = Date.now() - 6 * 24 * 60 * 60 * 1000;
      localStorage.setItem(POPUP_STORAGE_KEY, sixDaysAgo.toString());

      expect(isPopupHidden()).toBe(true);
    });

    it('정확히 7일이면 false를 반환한다', () => {
      const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
      localStorage.setItem(POPUP_STORAGE_KEY, sevenDaysAgo.toString());

      expect(isPopupHidden()).toBe(false);
    });

    it('7일 이상이면 false를 반환한다 (8일 전)', () => {
      const eightDaysAgo = Date.now() - 8 * 24 * 60 * 60 * 1000;
      localStorage.setItem(POPUP_STORAGE_KEY, eightDaysAgo.toString());

      expect(isPopupHidden()).toBe(false);
    });

    it('7일 이상이면 false를 반환한다 (30일 전)', () => {
      const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
      localStorage.setItem(POPUP_STORAGE_KEY, thirtyDaysAgo.toString());

      expect(isPopupHidden()).toBe(false);
    });

    it('방금 저장한 경우 true를 반환한다', () => {
      localStorage.setItem(POPUP_STORAGE_KEY, Date.now().toString());

      expect(isPopupHidden()).toBe(true);
    });

    it('잘못된 형식의 날짜는 NaN으로 처리되어 false를 반환한다', () => {
      localStorage.setItem(POPUP_STORAGE_KEY, 'invalid_date');

      expect(isPopupHidden()).toBe(false);
    });
  });

  describe('DAYS_TO_HIDE 상수', () => {
    it('7일로 설정되어 있다', () => {
      expect(DAYS_TO_HIDE).toBe(7);
    });
  });

  describe('localStorage 키', () => {
    it('POPUP_STORAGE_KEY가 올바르게 정의되어 있다', () => {
      expect(POPUP_STORAGE_KEY).toBe('mainpage_popup_hidden_date');
    });
  });

  describe('통합 시나리오', () => {
    it('시나리오: 첫 방문 → 다시 보지 않기 → 6일 후 방문 → 7일 후 방문', () => {
      // 1. 첫 방문
      expect(isPopupHidden()).toBe(false);

      // 2. "다시 보지 않기" 클릭
      localStorage.setItem(POPUP_STORAGE_KEY, Date.now().toString());
      expect(isPopupHidden()).toBe(true);

      // 3. 6일 후 방문 (아직 숨김)
      const sixDaysAgo = Date.now() - 6 * 24 * 60 * 60 * 1000;
      localStorage.setItem(POPUP_STORAGE_KEY, sixDaysAgo.toString());
      expect(isPopupHidden()).toBe(true);

      // 4. 7일 후 방문 (다시 표시)
      const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
      localStorage.setItem(POPUP_STORAGE_KEY, sevenDaysAgo.toString());
      expect(isPopupHidden()).toBe(false);
    });

  });
});

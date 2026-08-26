import { act, renderHook } from '@testing-library/react';
import { SATISFACTION_ASK_THRESHOLD } from '@/constants/appReview';
import { STORAGE_KEYS } from '@/constants/storageKeys';
import useSatisfactionSurvey, { countClubView } from './useSatisfactionSurvey';

// 앱은 userAgent prop으로 UA를 통째로 교체한다. 실제로 오는 값이 이것뿐이다.
const WEBVIEW_UA = 'MoadongApp/1.6.0 (iOS)';
const BROWSER_UA = 'Mozilla/5.0 (iPhone) Safari/605.1.15';

const setUserAgent = (value: string) =>
  Object.defineProperty(navigator, 'userAgent', {
    value,
    configurable: true,
  });

/** 로컬 정오로 맞춰 시간대에 따라 날짜가 밀리지 않게 한다 */
const setToday = (isoDate: string) =>
  jest.setSystemTime(new Date(`${isoDate}T12:00:00`));

const open = () => renderHook(() => useSatisfactionSurvey());

beforeEach(() => {
  jest.useFakeTimers();
  localStorage.clear();
  setUserAgent(WEBVIEW_UA);
  setToday('2026-08-14');
});

afterEach(() => {
  jest.useRealTimers();
});

describe('useSatisfactionSurvey', () => {
  describe('노출 조건 — 방문일', () => {
    it('첫 방문에는 묻지 않는다', () => {
      const { result } = open();

      expect(result.current.isOpen).toBe(false);
      expect(localStorage.getItem(STORAGE_KEYS.VISIT_DAY_COUNT)).toBe('1');
    });

    it('같은 날 몇 번을 열어도 하루로 센다', () => {
      open();
      open();
      open();

      expect(localStorage.getItem(STORAGE_KEYS.VISIT_DAY_COUNT)).toBe('1');
    });

    it(`서로 다른 날 ${SATISFACTION_ASK_THRESHOLD}일을 방문하면 묻는다`, () => {
      setToday('2026-08-14');
      expect(open().result.current.isOpen).toBe(false);

      setToday('2026-08-17');
      expect(open().result.current.isOpen).toBe(false);

      // 연속일이 아니어도 서로 다른 날이면 센다
      setToday('2026-08-23');
      expect(open().result.current.isOpen).toBe(true);
    });

    it('하루 만에는 임계값을 채울 수 없다', () => {
      for (let i = 0; i < SATISFACTION_ASK_THRESHOLD * 2; i += 1) open();

      expect(open().result.current.isOpen).toBe(false);
    });
  });

  describe('노출 조건 — 동아리 조회', () => {
    it(`조회가 ${SATISFACTION_ASK_THRESHOLD}회면 방문일과 무관하게 묻는다`, () => {
      for (let i = 0; i < SATISFACTION_ASK_THRESHOLD; i += 1) countClubView();

      const { result } = open();

      expect(result.current.isOpen).toBe(true);
      expect(localStorage.getItem(STORAGE_KEYS.VISIT_DAY_COUNT)).toBe('1');
    });
  });

  describe('노출하지 않는 경우', () => {
    it('브라우저에서는 조건을 채워도 묻지 않는다', () => {
      setUserAgent(BROWSER_UA);
      for (let i = 0; i < SATISFACTION_ASK_THRESHOLD; i += 1) countClubView();

      expect(open().result.current.isOpen).toBe(false);
    });

    it('이미 답한 사용자에게는 다시 묻지 않는다', () => {
      localStorage.setItem(STORAGE_KEYS.SATISFACTION_ANSWERED, 'true');
      for (let i = 0; i < SATISFACTION_ASK_THRESHOLD; i += 1) countClubView();

      expect(open().result.current.isOpen).toBe(false);
    });
  });

  describe('응답 처리', () => {
    const opened = () => {
      for (let i = 0; i < SATISFACTION_ASK_THRESHOLD; i += 1) countClubView();
      return open();
    };

    it('답을 받으면 닫고 다시 묻지 않도록 기록한다', () => {
      const { result } = opened();

      act(() => result.current.closeForever());

      expect(result.current.isOpen).toBe(false);
      expect(localStorage.getItem(STORAGE_KEYS.SATISFACTION_ANSWERED)).toBe(
        'true',
      );
    });

    it('미루면 카운터만 비우고 답한 것으로 치지 않는다', () => {
      const { result } = opened();

      act(() => result.current.snooze());

      expect(result.current.isOpen).toBe(false);
      expect(localStorage.getItem(STORAGE_KEYS.VISIT_DAY_COUNT)).toBe('0');
      expect(localStorage.getItem(STORAGE_KEYS.CLUB_VIEW_COUNT)).toBe('0');
      expect(
        localStorage.getItem(STORAGE_KEYS.SATISFACTION_ANSWERED),
      ).toBeNull();
    });

    it('미룬 당일에는 다시 뜨지 않는다', () => {
      const { result } = opened();
      act(() => result.current.snooze());

      expect(open().result.current.isOpen).toBe(false);
      expect(localStorage.getItem(STORAGE_KEYS.VISIT_DAY_COUNT)).toBe('0');
    });

    it(`미룬 뒤에는 ${SATISFACTION_ASK_THRESHOLD}일을 더 방문해야 다시 묻는다`, () => {
      const { result } = opened();
      act(() => result.current.snooze());

      setToday('2026-08-15');
      expect(open().result.current.isOpen).toBe(false);

      setToday('2026-08-16');
      expect(open().result.current.isOpen).toBe(false);

      setToday('2026-08-17');
      expect(open().result.current.isOpen).toBe(true);
    });
  });
});

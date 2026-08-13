import { act, renderHook } from '@testing-library/react';
import { SATISFACTION_ASK_THRESHOLD } from '@/constants/appReview';
import { STORAGE_KEYS } from '@/constants/storageKeys';
import useSatisfactionSurvey, { countClubView } from './useSatisfactionSurvey';

const WEBVIEW_UA = 'Mozilla/5.0 (iPhone) MoadongApp/1.6.0';
const BROWSER_UA = 'Mozilla/5.0 (iPhone) Safari/605.1.15';

const setUserAgent = (value: string) =>
  Object.defineProperty(navigator, 'userAgent', {
    value,
    configurable: true,
  });

/** 세션 플래그가 남아 있으면 다음 렌더에서 접속 수가 오르지 않는다 */
const startNewSession = () => sessionStorage.clear();

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
  setUserAgent(WEBVIEW_UA);
});

describe('useSatisfactionSurvey', () => {
  describe('노출 조건', () => {
    it(`앱 접속이 ${SATISFACTION_ASK_THRESHOLD}회 미만이면 묻지 않는다`, () => {
      const { result } = renderHook(() => useSatisfactionSurvey());

      expect(result.current.isOpen).toBe(false);
      expect(localStorage.getItem(STORAGE_KEYS.APP_VISIT_COUNT)).toBe('1');
    });

    it(`앱 접속이 ${SATISFACTION_ASK_THRESHOLD}회가 되면 묻는다`, () => {
      for (let i = 1; i < SATISFACTION_ASK_THRESHOLD; i += 1) {
        startNewSession();
        renderHook(() => useSatisfactionSurvey());
      }

      startNewSession();
      const { result } = renderHook(() => useSatisfactionSurvey());

      expect(result.current.isOpen).toBe(true);
    });

    it(`동아리 조회가 ${SATISFACTION_ASK_THRESHOLD}회면 접속 수와 무관하게 묻는다`, () => {
      for (let i = 0; i < SATISFACTION_ASK_THRESHOLD; i += 1) countClubView();

      const { result } = renderHook(() => useSatisfactionSurvey());

      expect(result.current.isOpen).toBe(true);
      expect(localStorage.getItem(STORAGE_KEYS.APP_VISIT_COUNT)).toBe('1');
    });

    it('같은 세션에서 다시 렌더해도 접속 수는 한 번만 오른다', () => {
      renderHook(() => useSatisfactionSurvey());
      renderHook(() => useSatisfactionSurvey());

      expect(localStorage.getItem(STORAGE_KEYS.APP_VISIT_COUNT)).toBe('1');
    });

    it('브라우저에서는 조건을 채워도 묻지 않는다', () => {
      setUserAgent(BROWSER_UA);
      for (let i = 0; i < SATISFACTION_ASK_THRESHOLD; i += 1) countClubView();

      const { result } = renderHook(() => useSatisfactionSurvey());

      expect(result.current.isOpen).toBe(false);
    });

    it('이미 답한 사용자에게는 다시 묻지 않는다', () => {
      localStorage.setItem(STORAGE_KEYS.SATISFACTION_ANSWERED, 'true');
      for (let i = 0; i < SATISFACTION_ASK_THRESHOLD; i += 1) countClubView();

      const { result } = renderHook(() => useSatisfactionSurvey());

      expect(result.current.isOpen).toBe(false);
    });
  });

  describe('응답 처리', () => {
    const openedHook = () => {
      for (let i = 0; i < SATISFACTION_ASK_THRESHOLD; i += 1) countClubView();
      return renderHook(() => useSatisfactionSurvey());
    };

    it('답을 받으면 닫고 다시 묻지 않도록 기록한다', () => {
      const { result } = openedHook();

      act(() => result.current.closeForever());

      expect(result.current.isOpen).toBe(false);
      expect(localStorage.getItem(STORAGE_KEYS.SATISFACTION_ANSWERED)).toBe(
        'true',
      );
    });

    it('미루면 카운터를 비워 임계값만큼 더 쓴 뒤에 다시 묻는다', () => {
      const { result } = openedHook();

      act(() => result.current.snooze());

      expect(result.current.isOpen).toBe(false);
      expect(localStorage.getItem(STORAGE_KEYS.CLUB_VIEW_COUNT)).toBe('0');
      expect(localStorage.getItem(STORAGE_KEYS.APP_VISIT_COUNT)).toBe('0');
      expect(localStorage.getItem(STORAGE_KEYS.SATISFACTION_ANSWERED)).toBeNull();
    });

    it('미룬 뒤 다음 세션에서는 조건을 다시 채워야 묻는다', () => {
      const { result } = openedHook();
      act(() => result.current.snooze());

      startNewSession();
      const afterSnooze = renderHook(() => useSatisfactionSurvey());

      expect(afterSnooze.result.current.isOpen).toBe(false);
    });
  });
});

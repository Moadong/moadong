import { useState } from 'react';
import { SATISFACTION_ASK_THRESHOLD } from '@/constants/appReview';
import { STORAGE_KEYS } from '@/constants/storageKeys';
import isInAppWebView from '@/utils/isInAppWebView';

const readCount = (key: string) => Number(localStorage.getItem(key)) || 0;

const bumpCount = (key: string) =>
  localStorage.setItem(key, String(readCount(key) + 1));

/** 기기 로컬 기준 날짜. toISOString은 UTC라 한국에서는 오전 9시에 날짜가 바뀐다 */
const today = () => {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');

  return `${now.getFullYear()}-${month}-${day}`;
};

/** 동아리 상세를 열 때마다 부른다. 방문일 수와 함께 노출 조건이 된다 */
export const countClubView = () => bumpCount(STORAGE_KEYS.CLUB_VIEW_COUNT);

/**
 * 첫 렌더에 딱 한 번 평가한다.
 *
 * 방문일은 날짜가 바뀔 때만 오르므로 StrictMode가 두 번 호출해도 결과가 같다.
 * 그래서 이펙트 없이 useState 초기화에서 호출할 수 있다.
 */
const evaluateOnMount = () => {
  if (!isInAppWebView()) return false;
  if (localStorage.getItem(STORAGE_KEYS.SATISFACTION_ANSWERED) === 'true') {
    return false;
  }

  // 실행 횟수가 아니라 방문한 '날'을 센다. 하루에 몇 번을 켜든 1일이라
  // 하루 만에 임계값을 채울 수 없고, 웹뷰 생명주기와도 무관하다.
  if (localStorage.getItem(STORAGE_KEYS.LAST_VISIT_DATE) !== today()) {
    localStorage.setItem(STORAGE_KEYS.LAST_VISIT_DATE, today());
    bumpCount(STORAGE_KEYS.VISIT_DAY_COUNT);
  }

  return (
    readCount(STORAGE_KEYS.VISIT_DAY_COUNT) >= SATISFACTION_ASK_THRESHOLD ||
    readCount(STORAGE_KEYS.CLUB_VIEW_COUNT) >= SATISFACTION_ASK_THRESHOLD
  );
};

/**
 * 충분히 써본 사용자에게 앱 접속 시 만족도를 묻는다.
 * 만족하면 스토어로, 아니면 우체통으로 보내 불만을 우리가 먼저 받는다.
 */
const useSatisfactionSurvey = () => {
  const [isOpen, setIsOpen] = useState(evaluateOnMount);

  const closeForever = () => {
    localStorage.setItem(STORAGE_KEYS.SATISFACTION_ANSWERED, 'true');
    setIsOpen(false);
  };

  /**
   * 미루면 카운터를 비워 임계값만큼 더 쓴 뒤에 다시 묻는다.
   * 마지막 방문일은 오늘 그대로 두어 오늘이 다시 세지지 않게 한다.
   * 방문일 기준이라 재노출까지 최소 임계값만큼의 날이 보장된다.
   */
  const snooze = () => {
    localStorage.setItem(STORAGE_KEYS.VISIT_DAY_COUNT, '0');
    localStorage.setItem(STORAGE_KEYS.CLUB_VIEW_COUNT, '0');
    setIsOpen(false);
  };

  return { isOpen, closeForever, snooze };
};

export default useSatisfactionSurvey;

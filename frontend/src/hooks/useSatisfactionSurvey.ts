import { useState } from 'react';
import { SATISFACTION_ASK_THRESHOLD } from '@/constants/appReview';
import { STORAGE_KEYS } from '@/constants/storageKeys';
import isInAppWebView from '@/utils/isInAppWebView';

const VISIT_COUNTED_IN_SESSION = 'satisfactionVisitCounted';

const readCount = (key: string) => Number(localStorage.getItem(key)) || 0;

const bumpCount = (key: string) =>
  localStorage.setItem(key, String(readCount(key) + 1));

/** 동아리 상세를 열 때마다 부른다. 앱 접속 수와 함께 노출 조건이 된다 */
export const countClubView = () => bumpCount(STORAGE_KEYS.CLUB_VIEW_COUNT);

/**
 * 첫 렌더에 딱 한 번 평가한다.
 *
 * 세션 플래그로 접속 수 증가를 막아두어 StrictMode가 두 번 호출해도 같은 결과가 나온다.
 * 그래서 이펙트 없이 useState 초기화에서 호출할 수 있다.
 */
const evaluateOnMount = () => {
  // 스토어 리뷰는 앱에서만 의미가 있다. 브라우저에서는 묻지 않는다.
  if (!isInAppWebView()) return false;
  if (localStorage.getItem(STORAGE_KEYS.SATISFACTION_ANSWERED) === 'true') {
    return false;
  }

  if (!sessionStorage.getItem(VISIT_COUNTED_IN_SESSION)) {
    sessionStorage.setItem(VISIT_COUNTED_IN_SESSION, 'true');
    bumpCount(STORAGE_KEYS.APP_VISIT_COUNT);
  }

  return (
    readCount(STORAGE_KEYS.APP_VISIT_COUNT) >= SATISFACTION_ASK_THRESHOLD ||
    readCount(STORAGE_KEYS.CLUB_VIEW_COUNT) >= SATISFACTION_ASK_THRESHOLD
  );
};

/**
 * 충분히 써본 사용자에게 앱 접속 시 만족도를 묻는다.
 * 만족하면 스토어로, 아니면 우체통으로 보내 불만을 우리가 먼저 받는다.
 */
const useSatisfactionSurvey = () => {
  const [isOpen, setIsOpen] = useState(evaluateOnMount);

  /** 답을 받았으면 다시 묻지 않는다 */
  const closeForever = () => {
    localStorage.setItem(STORAGE_KEYS.SATISFACTION_ANSWERED, 'true');
    setIsOpen(false);
  };

  /** 미루면 카운터를 비워 임계값만큼 더 쓴 뒤에 다시 묻는다 */
  const snooze = () => {
    localStorage.setItem(STORAGE_KEYS.APP_VISIT_COUNT, '0');
    localStorage.setItem(STORAGE_KEYS.CLUB_VIEW_COUNT, '0');
    setIsOpen(false);
  };

  return { isOpen, closeForever, snooze };
};

export default useSatisfactionSurvey;

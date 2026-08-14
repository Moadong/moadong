import { useEffect, useState } from 'react';
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

const isTodayCounted = () =>
  localStorage.getItem(STORAGE_KEYS.LAST_VISIT_DATE) === today();

/**
 * 첫 렌더에 딱 한 번 평가한다. 읽기만 하고 아무것도 쓰지 않는다.
 *
 * 오늘 방문이 아직 기록 전이면 곧 기록될 몫을 더해서 판단한다.
 * 기록은 이펙트에서 한다 — 렌더 중에 저장소를 바꾸면 커밋되지 않은 렌더도 방문일을 남긴다.
 */
const shouldAskOnMount = () => {
  if (!isInAppWebView()) return false;
  if (localStorage.getItem(STORAGE_KEYS.SATISFACTION_ANSWERED) === 'true') {
    return false;
  }

  const pendingVisitDay = isTodayCounted() ? 0 : 1;

  return (
    readCount(STORAGE_KEYS.VISIT_DAY_COUNT) + pendingVisitDay >=
      SATISFACTION_ASK_THRESHOLD ||
    readCount(STORAGE_KEYS.CLUB_VIEW_COUNT) >= SATISFACTION_ASK_THRESHOLD
  );
};

/**
 * 충분히 써본 사용자에게 앱 접속 시 만족도를 묻는다.
 * 만족하면 스토어로, 아니면 우체통으로 보내 불만을 우리가 먼저 받는다.
 */
const useSatisfactionSurvey = () => {
  const [isOpen, setIsOpen] = useState(shouldAskOnMount);

  // 방문일 기록은 커밋된 뒤에 한다. 날짜가 같으면 다시 올리지 않으므로
  // StrictMode가 이펙트를 두 번 실행해도 하루는 한 번만 센다.
  useEffect(() => {
    if (!isInAppWebView() || isTodayCounted()) return;

    localStorage.setItem(STORAGE_KEYS.LAST_VISIT_DATE, today());
    bumpCount(STORAGE_KEYS.VISIT_DAY_COUNT);
  }, []);

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

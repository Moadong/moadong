export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  /** 우체통용 익명 학생 토큰. 만료가 없어 refresh 흐름 대신 401 시 재발급만 한다 */
  STUDENT_ACCESS_TOKEN: 'studentAccessToken',
  /** 만족도 모달 노출 조건. 둘 중 하나가 임계값에 닿으면 묻는다 */
  VISIT_DAY_COUNT: 'visitDayCount',
  CLUB_VIEW_COUNT: 'clubViewCount',
  /** 같은 날 여러 번 켜도 방문일이 한 번만 오르게 하는 기준 */
  LAST_VISIT_DATE: 'lastVisitDate',
  /** 답을 했으면 다시 묻지 않는다 */
  SATISFACTION_ANSWERED: 'satisfactionAnswered',
  HAS_CONSENTED_PERSONAL_INFO: 'hasConsentedPersonalInfo',
  QUERY_CACHE: 'MOADONG_QUERY_CACHE',
} as const;

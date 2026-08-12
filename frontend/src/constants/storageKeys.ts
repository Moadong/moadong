export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  /** 우체통용 익명 학생 토큰. 만료가 없어 refresh 흐름 대신 401 시 재발급만 한다 */
  STUDENT_ACCESS_TOKEN: 'studentAccessToken',
  HAS_CONSENTED_PERSONAL_INFO: 'hasConsentedPersonalInfo',
  QUERY_CACHE: 'MOADONG_QUERY_CACHE',
} as const;

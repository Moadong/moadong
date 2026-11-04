export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  /** 우체통용 익명 학생 토큰. 만료가 없어 refresh 흐름 대신 401 시 재발급만 한다 */
  STUDENT_ACCESS_TOKEN: 'studentAccessToken',
  /** 소셜 로그인(카카오·구글)으로 인증된 학생 OAuth 토큰 */
  STUDENT_LOGIN_ACCESS_TOKEN: 'studentLoginAccessToken',
  /** 소셜 로그인 시작 시 저장하는 OAuth provider. 콜백에서 읽고 제거한다 */
  STUDENT_OAUTH_PROVIDER: 'studentOAuthProvider',
  /** 소셜 로그인 CSRF 방어용 state. 콜백에서 검증 후 제거한다 */
  STUDENT_OAUTH_STATE: 'studentOAuthState',
  FEEDBACK_PROMPT_ANONYMOUS_ID: 'moadong.feedbackPrompt.anonymousClientId',
  /** 만족도 모달 노출 조건. 둘 중 하나가 임계값에 닿으면 묻는다 */
  VISIT_DAY_COUNT: 'visitDayCount',
  CLUB_VIEW_COUNT: 'clubViewCount',
  /** 같은 날 여러 번 켜도 방문일이 한 번만 오르게 하는 기준 */
  LAST_VISIT_DATE: 'lastVisitDate',
  /** 답을 했으면 다시 묻지 않는다 */
  SATISFACTION_ANSWERED: 'satisfactionAnswered',
  HAS_CONSENTED_PERSONAL_INFO: 'hasConsentedPersonalInfo',
  QUERY_CACHE: 'MOADONG_QUERY_CACHE',
  /** 관리자 로그인 시 귀속된 동아리 ID. 새로고침 후에도 관리자 UI 유지에 사용 */
  ADMIN_CLUB_ID: 'adminClubId',
  /** 디자인 피드백 툴바. `?design=1`로 켜고 `?design=0`으로 끈다 */
  DESIGN_FEEDBACK: 'designFeedback',
} as const;

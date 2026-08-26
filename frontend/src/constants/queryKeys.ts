export const queryKeys = {
  googleCalendar: {
    all: ['googleCalendar'] as const,
    calendars: () => ['googleCalendar', 'calendars'] as const,
    events: (calendarId: string, timeMin: string, timeMax: string) =>
      ['googleCalendar', 'events', calendarId, timeMin, timeMax] as const,
  },
  customCalendarEvents: {
    all: ['customCalendarEvents'] as const,
    list: () => ['customCalendarEvents', 'list'] as const,
  },
  notionCalendar: {
    all: ['notionCalendar'] as const,
    databases: () => ['notionCalendar', 'databases'] as const,
    pages: () => ['notionCalendar', 'pages'] as const,
  },
  hiddenCalendarEvents: {
    all: ['hiddenCalendarEvents'] as const,
    list: () => ['hiddenCalendarEvents', 'list'] as const,
  },
  applicants: {
    all: ['clubApplicants'] as const,
    detail: (applicationFormId: string) =>
      ['clubApplicants', applicationFormId] as const,
  },
  application: {
    all: ['applicationForm'] as const,
    detail: (clubId: string, applicationFormId: string) =>
      ['applicationForm', clubId, applicationFormId] as const,
    aiDraftQuota: (clubId: string) =>
      ['applicationForm', 'aiDraftQuota', clubId] as const,
  },
  club: {
    all: ['clubs'] as const,
    detail: (clubParam: string) => ['clubDetail', clubParam] as const,
    calendarEvents: (clubParam: string) =>
      ['clubCalendarEvents', clubParam] as const,
    list: (
      keyword: string,
      recruitmentStatus: string,
      category: string,
      division: string,
    ) => ['clubs', keyword, recruitmentStatus, category, division] as const,
    suggestions: (keyword: string) =>
      ['clubs', 'suggestions', keyword] as const,
  },
  promotion: {
    all: ['promotions'] as const,
    list: () => ['promotions', 'list'] as const,
  },
  feedback: {
    all: ['feedback'] as const,
    /** 카테고리별로 나뉜 받은 편지 목록을 한 번에 무효화하는 접두사 */
    receivedAll: ['feedback', 'received'] as const,
    received: (category?: string) =>
      ['feedback', 'received', category ?? 'ALL'] as const,
    /** 읽음 처리 시 목록만 무효화하려고 상세는 'received' 접두사를 쓰지 않는다 */
    receivedDetail: (letterId: string) =>
      ['feedback', 'letter', letterId] as const,
    sent: () => ['feedback', 'sent'] as const,
    sentDetail: (feedbackId: string) =>
      ['feedback', 'sent', 'detail', feedbackId] as const,
  },
  banner: {
    all: ['banner'] as const,
    list: (type: 'WEB' | 'APP_HOME' | 'WEB_MOBILE') =>
      ['banner', type] as const,
  },
  game: {
    all: ['game'] as const,
    ranking: () => ['game', 'ranking'] as const,
  },
  statistics: {
    overview: (startDate: string, endDate: string) =>
      ['statistics', 'overview', startDate, endDate] as const,
    trend: (startDate: string, endDate: string) =>
      ['statistics', 'trend', startDate, endDate] as const,
    searchKeywords: (startDate: string, endDate: string, limit: number) =>
      ['statistics', 'searchKeywords', startDate, endDate, limit] as const,
  },
} as const;

export const queryKeys = {
  googleCalendar: {
    all: ['googleCalendar'] as const,
    calendars: () => ['googleCalendar', 'calendars'] as const,
    events: (calendarId: string, timeMin: string, timeMax: string) =>
      ['googleCalendar', 'events', calendarId, timeMin, timeMax] as const,
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
  banner: {
    all: ['banner'] as const,
    list: (type: 'WEB' | 'APP_HOME' | 'WEB_MOBILE') =>
      ['banner', type] as const,
  },
  game: {
    all: ['game'] as const,
    ranking: () => ['game', 'ranking'] as const,
  },
} as const;

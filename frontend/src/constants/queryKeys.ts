export const queryKeys = {
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
    list: (
      keyword: string,
      recruitmentStatus: string,
      category: string,
      division: string,
    ) => ['clubs', keyword, recruitmentStatus, category, division] as const,
  },
  promotion: {
    all: ['promotions'] as const,
    list: () => ['promotions', 'list'] as const,
  },
} as const;

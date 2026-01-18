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
    detail: (clubId: string) => ['clubDetail', clubId] as const,
    list: (
      keyword: string,
      recruitmentStatus: string,
      category: string,
      division: string,
    ) => ['clubs', keyword, recruitmentStatus, category, division] as const,
  },
} as const;

import { SNS_CONFIG } from '@/constants/snsConfig';
import { ClubId } from '@/types/branded';

export type RecruitmentStatus = 'OPEN' | 'CLOSED' | 'UPCOMING' | 'ALWAYS';

export interface Club {
  id: ClubId;
  name: string;
  logo: string;
  cover?: string;
  tags: string[];
  recruitmentStatus: RecruitmentStatus;
  division: string;
  category: string;
  introduction: string;
}

export type SNSPlatform = keyof typeof SNS_CONFIG;

export interface ClubDetail extends Club {
  description: DetailedDescription;

  state: string;
  feeds: string[];

  presidentName: string;
  presidentPhoneNumber: string;

  recruitmentForm: string;
  recruitmentStart: string;
  recruitmentEnd: string;
  recruitmentTarget: string;

  socialLinks: Record<SNSPlatform, string>;
  externalApplicationUrl?: string;
  hasCalendarConnection?: boolean;
}

export type CustomEventType = 'SINGLE' | 'PERIOD' | 'RECURRING' | 'MULTI';

export type RecurrenceFrequency = 'WEEKLY' | 'MONTHLY' | 'YEARLY';

export type CalendarEventColor =
  | 'PINK'
  | 'YELLOW'
  | 'MINT'
  | 'BLUE'
  | 'PURPLE'
  | 'ORANGE';

export interface EventRecurrence {
  frequency: RecurrenceFrequency;
  /** 매주 반복 시 요일 (0=일 ~ 6=토) */
  weekdays?: number[];
  /** 종료일 없으면 무기한 반복 */
  end?: string;
  /** '이 일정만 삭제'로 제외된 발생일 (YYYY-MM-DD) */
  excludedDates?: string[];
}

export type DeleteScope = 'THIS' | 'THIS_AND_FOLLOWING' | 'ALL';

export interface DeleteCustomCalendarEventOptions {
  scope?: DeleteScope;
  /** scope가 THIS / THIS_AND_FOLLOWING일 때 기준 발생일 (YYYY-MM-DD) */
  date?: string;
}

export interface ClubCalendarEvent {
  id: string;
  title: string;
  start: string;
  end?: string;
  url?: string;
  description?: string;
  source?: 'NOTION' | 'GOOGLE' | 'CUSTOM';
  eventType?: CustomEventType;
  color?: CalendarEventColor;
  /** MULTI: 선택된 날짜 목록 */
  dates?: string[];
  /** RECURRING: 반복 규칙 (start가 반복 시작일) */
  recurrence?: EventRecurrence;
}

export interface CustomCalendarEventInput {
  title: string;
  start: string;
  end?: string;
  url?: string;
  description?: string;
  eventType?: CustomEventType;
  color?: CalendarEventColor;
  dates?: string[];
  recurrence?: EventRecurrence;
}

export interface HiddenCalendarEvent {
  source: 'GOOGLE' | 'NOTION';
  eventId: string;
}

export interface ClubDescription {
  id: ClubId;
  recruitmentStart: string | null;
  recruitmentEnd: string | null;
  recruitmentTarget: string;
}

export const SemesterTerm = {
  FIRST: 'FIRST',
  SECOND: 'SECOND',
} as const;

export type SemesterTermType = (typeof SemesterTerm)[keyof typeof SemesterTerm];

export interface Award {
  year: number;
  semesterTerm: SemesterTermType;
  achievements: string[];
}

export interface IdealCandidate {
  tags: string[];
  content: string;
}

export interface FAQ {
  id?: string;
  question: string;
  answer: string;
}

export interface DetailedDescription {
  introDescription: string;
  activityDescription: string;
  awards: Award[];
  idealCandidate: IdealCandidate;
  benefits: string;
  faqs: FAQ[];
}

export interface ClubApiResponse {
  id: string;
  name: string;
  logo: string;
  cover: string;
  tags: string[];
  state: string;
  introduction: string;
  description: DetailedDescription;
  recruitmentPeriod: string;
  recruitmentStatus: string;
  externalApplicationUrl: string;
  socialLinks: Record<SNSPlatform, string>;
  category: string;
  division: string;
}

export interface ClubSearchResponse {
  clubs: Club[];
  totalCount: number;
}

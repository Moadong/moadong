import { AnswerItem } from './application';

export enum ApplicationStatus {
  SUBMITTED = 'SUBMITTED', // 제출 완료
  INTERVIEW_SCHEDULED = 'INTERVIEW_SCHEDULED', // 면접 일정 확정
  ACCEPTED = 'ACCEPTED', // 제안 수락
  DECLINED = 'DECLINED', // 제안 거절
}

export interface ApplicantsInfo {
  total: number;
  reviewRequired: number;
  scheduledInterview: number;
  accepted: number;
  applicants: Applicant[];
}

export interface Applicant {
  id: string;
  status: ApplicationStatus;
  answers: AnswerItem[];
  memo: string;
  createdAt: string;
  applicationFormId: string;
}

export interface UpdateApplicantParams {
  memo: string;
  status: ApplicationStatus;
  applicantId: string | undefined;
}

export interface ApplicantStatusEvent {
  applicantId: string;
  status: ApplicationStatus;
  memo: string;
  timestamp: string;
  clubId: string;
  applicationFormId: string;
}

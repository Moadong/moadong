import { AnswerItem } from './application';
import { ApplicantId, ApplicationFormId, ClubId } from './branded';

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
  id: ApplicantId;
  status: ApplicationStatus;
  answers: AnswerItem[];
  memo: string;
  createdAt: string;
  applicationFormId: ApplicationFormId;
}

export interface UpdateApplicantParams {
  memo: string;
  status: ApplicationStatus;
  applicantId: ApplicantId | undefined;
}

export interface ApplicantStatusEvent {
  applicantId: ApplicantId;
  status: ApplicationStatus;
  memo: string;
  timestamp: string;
  clubId: ClubId;
  applicationFormId: ApplicationFormId;
}

export interface ApplicantSSECallbacks {
  onStatusChange: (event: ApplicantStatusEvent) => void;
  onError: (error: Error) => void;
}

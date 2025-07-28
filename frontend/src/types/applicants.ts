import { AnswerItem } from "./application";

export enum ApplicationStatus {
  DRAFT = 'DRAFT', // 작성 중
  SUBMITTED = 'SUBMITTED', // 제출 완료
  SCREENING = 'SCREENING', // 서류 심사 중
  SCREENING_PASSED = 'SCREENING_PASSED', // 서류 통과
  SCREENING_FAILED = 'SCREENING_FAILED', // 서류 탈락
  INTERVIEW_SCHEDULED = 'INTERVIEW_SCHEDULED', // 면접 일정 확정
  INTERVIEW_IN_PROGRESS = 'INTERVIEW_IN_PROGRESS', // 면접 진행 중
  INTERVIEW_PASSED = 'INTERVIEW_PASSED', // 면접 통과
  INTERVIEW_FAILED = 'INTERVIEW_FAILED', // 면접 탈락
  OFFERED = 'OFFERED', // 최종 합격 제안
  ACCEPTED = 'ACCEPTED', // 제안 수락
  DECLINED = 'DECLINED', // 제안 거절
  CANCELED_BY_APPLICANT = 'CANCELED_BY_APPLICANT', // 지원자 자진 철회
}

export const APPLICATION_STATUS_KR: Record<ApplicationStatus, string> = {
  [ApplicationStatus.DRAFT]: '작성 중',
  [ApplicationStatus.SUBMITTED]: '제출 완료',
  [ApplicationStatus.SCREENING]: '서류 심사 중',
  [ApplicationStatus.SCREENING_PASSED]: '서류 통과',
  [ApplicationStatus.SCREENING_FAILED]: '서류 탈락',
  [ApplicationStatus.INTERVIEW_SCHEDULED]: '면접 일정 확정',
  [ApplicationStatus.INTERVIEW_IN_PROGRESS]: '면접 진행 중',
  [ApplicationStatus.INTERVIEW_PASSED]: '면접 통과',
  [ApplicationStatus.INTERVIEW_FAILED]: '면접 탈락',
  [ApplicationStatus.OFFERED]: '최종 합격 제안',
  [ApplicationStatus.ACCEPTED]: '제안 수락',
  [ApplicationStatus.DECLINED]: '제안 거절',
  [ApplicationStatus.CANCELED_BY_APPLICANT]: '지원자 자진 철회',
};

export interface ApplicantsInfo {
  total: number;
  reviewRequired: number;
  scheduledInterview: number;
  accepted: number;    
  applicants: Applicant[]
}

export interface Applicant {
  questionId: number;
  status: ApplicationStatus;
  answers: AnswerItem[]
}
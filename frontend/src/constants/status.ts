import { ApplicationStatus } from '@/types/applicants';

export const AVAILABLE_STATUSES = [
  ApplicationStatus.SUBMITTED, // 서류검토 (SUBMITTED 포함)
  ApplicationStatus.INTERVIEW_SCHEDULED, // 면접예정
  ApplicationStatus.ACCEPTED, // 합격
  ApplicationStatus.DECLINED, // 불합격
] as const;

import { ApplicationStatus } from '@/types/applicants';

const mapStatusToGroup = (
  status: ApplicationStatus,
): { status: ApplicationStatus; label: string } => {
  switch (status) {
    case ApplicationStatus.SUBMITTED:
      return { status: ApplicationStatus.SUBMITTED, label: '서류검토' };
    case ApplicationStatus.INTERVIEW_SCHEDULED:
      return {
        status: ApplicationStatus.INTERVIEW_SCHEDULED,
        label: '면접예정',
      };
    case ApplicationStatus.ACCEPTED:
      return { status: ApplicationStatus.ACCEPTED, label: '합격' };
    case ApplicationStatus.DECLINED:
      return { status: ApplicationStatus.DECLINED, label: '불합' };
    default:
      return { status: ApplicationStatus.SUBMITTED, label: '전체' };
  }
};

export default mapStatusToGroup;

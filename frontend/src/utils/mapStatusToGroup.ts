import { ApplicationStatus } from "@/types/applicants";

const mapStatusToGroup = (status: ApplicationStatus): { status: ApplicationStatus, label: string } => {
  switch (status) {
    case 'DRAFT':
    case 'SUBMITTED':
    case 'SCREENING':
      return { status: ApplicationStatus.DRAFT, label: '서류검토' };
    case 'SCREENING_PASSED':
    case 'INTERVIEW_SCHEDULED':
    case 'INTERVIEW_IN_PROGRESS':
      return { status: ApplicationStatus.INTERVIEW_SCHEDULED, label: '면접예정' };
    case 'INTERVIEW_PASSED':
    case 'OFFERED':
    case 'ACCEPTED':
      return { status: ApplicationStatus.ACCEPTED, label: '합격' };
    default:
      return { status: ApplicationStatus.DRAFT, label: '서류검토'};
  }
}

export default mapStatusToGroup;
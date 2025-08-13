import { ApplicationStatus } from "@/types/applicants";

const mapStatusToGroup = (status: ApplicationStatus): { status: ApplicationStatus, label: string } => {
  switch (status) {
    case ApplicationStatus.SUBMITTED:
    case ApplicationStatus.SCREENING:
      return { status: ApplicationStatus.SUBMITTED, label: '서류검토' };
    case ApplicationStatus.SCREENING_PASSED:
    case ApplicationStatus.INTERVIEW_SCHEDULED:
    case ApplicationStatus.INTERVIEW_IN_PROGRESS:
      return { status: ApplicationStatus.INTERVIEW_SCHEDULED, label: '면접예정' };
    case ApplicationStatus.INTERVIEW_PASSED:
    case ApplicationStatus.OFFERED:
    case ApplicationStatus.ACCEPTED:
      return { status: ApplicationStatus.ACCEPTED, label: '합격' };
    default:
      return { status: ApplicationStatus.SUBMITTED, label: '서류검토'};
  }
}

export default mapStatusToGroup;
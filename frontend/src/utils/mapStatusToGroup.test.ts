import mapStatusToGroup from './mapStatusToGroup';
import { ApplicationStatus } from '@/types/applicants';

describe('mapStatusToGroup', () => {
  it('should return correct label and status for SUBMITTED', () => {
    const result = mapStatusToGroup(ApplicationStatus.SUBMITTED);
    expect(result).toEqual({ status: ApplicationStatus.SUBMITTED, label: '서류검토' });
  });

  it('should return correct label and status for INTERVIEW_SCHEDULED', () => {
    const result = mapStatusToGroup(ApplicationStatus.INTERVIEW_SCHEDULED);
    expect(result).toEqual({ status: ApplicationStatus.INTERVIEW_SCHEDULED, label: '면접예정' });
  });

  it('should return correct label and status for ACCEPTED', () => {
    const result = mapStatusToGroup(ApplicationStatus.ACCEPTED);
    expect(result).toEqual({ status: ApplicationStatus.ACCEPTED, label: '합격' });
  });

  it('should return correct label and status for DECLINED', () => {
    const result = mapStatusToGroup(ApplicationStatus.DECLINED);
    expect(result).toEqual({ status: ApplicationStatus.DECLINED, label: '불합' });
  });

  it('should return default label and status for unknown status', () => {
    const result = mapStatusToGroup('UNKNOWN_STATUS' as ApplicationStatus);
    expect(result).toEqual({ status: ApplicationStatus.SUBMITTED, label: '전체' });
  });
});

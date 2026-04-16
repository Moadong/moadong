import { ApplicationStatus } from '@/types/applicants';
import mapStatusToGroup from './mapStatusToGroup';

describe('mapStatusToGroup', () => {
  it('ApplicationStatus.SUBMITTED일 때 서류검토와 함께 반환되어야 한다.', () => {
    const result = mapStatusToGroup(ApplicationStatus.SUBMITTED);
    expect(result).toEqual({ status: ApplicationStatus.SUBMITTED, label: '서류검토' });
  });

  it('ApplicationStatus.INTERVIEW_SCHEDULED일 때 면접예정과 함께 반환되어야 한다.', () => {
    const result = mapStatusToGroup(ApplicationStatus.INTERVIEW_SCHEDULED);
    expect(result).toEqual({
      status: ApplicationStatus.INTERVIEW_SCHEDULED,
      label: '면접예정',
    });
  });

  it('ApplicationStatus.ACCEPTED일 때 합격과 함께 반환되어야 한다.', () => {
    const result = mapStatusToGroup(ApplicationStatus.ACCEPTED);
    expect(result).toEqual({ status: ApplicationStatus.ACCEPTED, label: '합격' });
  });

  it('ApplicationStatus.DECLINED일 때 불합과 함께 반환되어야 한다.', () => {
    const result = mapStatusToGroup(ApplicationStatus.DECLINED);
    expect(result).toEqual({ status: ApplicationStatus.DECLINED, label: '불합' });
  });

  it('알 수 없는 상태일 때 기본값인 서류검토(전체)를 반환해야 한다.', () => {
    const result = mapStatusToGroup('UNKNOWN' as ApplicationStatus);
    expect(result).toEqual({ status: ApplicationStatus.SUBMITTED, label: '전체' });
  });
});

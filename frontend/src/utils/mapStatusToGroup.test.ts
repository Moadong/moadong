import { ApplicationStatus } from '@/types/applicants';
import mapStatusToGroup from './mapStatusToGroup';

describe('mapStatusToGroup 함수', () => {
  test('SUBMITTED 상태일 때 서류검토 라벨을 반환한다', () => {
    const result = mapStatusToGroup(ApplicationStatus.SUBMITTED);
    expect(result).toEqual({
      status: ApplicationStatus.SUBMITTED,
      label: '서류검토',
    });
  });

  test('INTERVIEW_SCHEDULED 상태일 때 면접예정 라벨을 반환한다', () => {
    const result = mapStatusToGroup(ApplicationStatus.INTERVIEW_SCHEDULED);
    expect(result).toEqual({
      status: ApplicationStatus.INTERVIEW_SCHEDULED,
      label: '면접예정',
    });
  });

  test('ACCEPTED 상태일 때 합격 라벨을 반환한다', () => {
    const result = mapStatusToGroup(ApplicationStatus.ACCEPTED);
    expect(result).toEqual({
      status: ApplicationStatus.ACCEPTED,
      label: '합격',
    });
  });

  test('DECLINED 상태일 때 불합 라벨을 반환한다', () => {
    const result = mapStatusToGroup(ApplicationStatus.DECLINED);
    expect(result).toEqual({
      status: ApplicationStatus.DECLINED,
      label: '불합',
    });
  });

  test('알 수 없는 상태일 때 SUBMITTED 상태와 전체 라벨을 반환한다', () => {
    // @ts-ignore: 테스트를 위해 잘못된 값을 강제로 전달
    const result = mapStatusToGroup('UNKNOWN' as ApplicationStatus);
    expect(result).toEqual({
      status: ApplicationStatus.SUBMITTED,
      label: '전체',
    });
  });
});

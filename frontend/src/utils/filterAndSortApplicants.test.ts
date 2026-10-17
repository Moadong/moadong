import { Applicant, ApplicationStatus } from '@/types/applicants';
import { AnswerItem } from '@/types/application';
import { asApplicantId, asApplicationFormId } from '@/types/branded';
import { filterAndSortApplicants } from './filterAndSortApplicants';

// 이름 질문(id 1)이 두 번째에 있는 지원서. 첫 번째 답은 학번이다
const applicant = (
  id: string,
  answers: AnswerItem[],
  createdAt = '2026-10-01T00:00:00',
): Applicant => ({
  id: asApplicantId(id),
  status: ApplicationStatus.SUBMITTED,
  answers,
  memo: '',
  createdAt,
  applicationFormId: asApplicationFormId('form'),
});

// 학번순(첫 번째 답)이면 lee가 먼저, 이름순이면 kim이 먼저라 둘을 구분할 수 있다
const kim = applicant('kim', [
  { id: 7, value: '20230009' },
  { id: 1, value: '김철수' },
]);
const lee = applicant('lee', [
  { id: 7, value: '20230002' },
  { id: 1, value: '이영희' },
]);
const noName = applicant('noName', [{ id: 7, value: '20230003' }]);

const nameSearch = (keyword: string) =>
  filterAndSortApplicants([kim, lee, noName], {
    selectedFilter: ['ALL'],
    keyword,
    selectedSort: 'date',
  }).map((a) => a.id);

const nameSort = (applicants: Applicant[]) =>
  filterAndSortApplicants(applicants, {
    selectedFilter: ['ALL'],
    keyword: '',
    selectedSort: 'name',
  }).map((a) => a.id);

describe('filterAndSortApplicants', () => {
  it('이름 질문이 첫 번째가 아니어도 이름으로 검색한다', () => {
    expect(nameSearch('영희')).toEqual(['lee']);
  });

  it('첫 번째 답(학번)으로는 검색되지 않는다', () => {
    expect(nameSearch('20230009')).toEqual([]);
  });

  it('이름 질문이 첫 번째가 아니어도 이름순으로 정렬한다', () => {
    expect(nameSort([lee, kim])).toEqual(['kim', 'lee']);
  });

  it('이름 답이 없는 지원자는 이름순 정렬에서 맨 앞에 온다', () => {
    expect(nameSort([kim, noName, lee])).toEqual(['noName', 'kim', 'lee']);
  });

  it('이름 답이 없는 지원자는 이름 검색에서 빠진다', () => {
    expect(nameSearch('2023')).toEqual([]);
  });
});

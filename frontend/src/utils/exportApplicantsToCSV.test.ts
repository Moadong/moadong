import { Applicant, ApplicationStatus } from '@/types/applicants';
import { Question } from '@/types/application';
import { exportApplicantsToCSV } from '@/utils/exportApplicantsToCSV';

const mockClick = jest.fn();
const mockLink = { href: '', download: '', click: mockClick };
let capturedBlobContent = '';

beforeEach(() => {
  jest
    .spyOn(document, 'createElement')
    .mockReturnValue(mockLink as unknown as HTMLElement);
  jest.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock-url');
  jest.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});
  global.Blob = jest.fn().mockImplementation((content: BlobPart[]) => {
    capturedBlobContent = content[0] as string;
    return { type: 'text/csv;charset=utf-8;' };
  }) as unknown as typeof Blob;
  mockClick.mockClear();
});

afterEach(() => {
  jest.restoreAllMocks();
});

const mockQuestions: Question[] = [
  {
    id: 1,
    title: '지원 동기',
    description: '',
    type: 'LONG_TEXT',
    options: { required: true },
    items: [],
  },
  {
    id: 2,
    title: '활동 가능 시간',
    description: '',
    type: 'SHORT_TEXT',
    options: { required: false },
    items: [],
  },
];

const mockApplicants: Applicant[] = [
  {
    id: 'applicant-1' as Applicant['id'],
    status: ApplicationStatus.SUBMITTED,
    answers: [
      { id: 1, value: '동아리 활동을 통해 성장하고 싶습니다.' },
      { id: 2, value: '주말 포함 매일' },
    ],
    memo: '면접 일정 조율 필요',
    createdAt: '2024-03-15T10:30:00Z',
    applicationFormId: 'form-1' as Applicant['applicationFormId'],
  },
  {
    id: 'applicant-2' as Applicant['id'],
    status: ApplicationStatus.INTERVIEW_SCHEDULED,
    answers: [
      { id: 1, value: '새로운 경험을 원합니다.' },
      { id: 2, value: '평일 저녁' },
    ],
    memo: '',
    createdAt: '2024-03-16T09:00:00Z',
    applicationFormId: 'form-1' as Applicant['applicationFormId'],
  },
];

describe('exportApplicantsToCSV', () => {
  it('BOM이 포함된 CSV를 생성한다', () => {
    exportApplicantsToCSV(mockApplicants, mockQuestions, '테스트');
    expect(capturedBlobContent.startsWith('\uFEFF')).toBe(true);
  });

  it('올바른 파일명으로 다운로드된다', () => {
    exportApplicantsToCSV(mockApplicants, mockQuestions, '동아리_지원서');
    expect(mockLink.download).toBe('동아리_지원서.csv');
    expect(mockClick).toHaveBeenCalledTimes(1);
  });

  it('헤더가 제출일시, 상태, 질문 제목, 메모 순서로 생성된다', () => {
    exportApplicantsToCSV(mockApplicants, mockQuestions, '테스트');
    const lines = capturedBlobContent.replace('\uFEFF', '').split('\n');
    expect(lines[0]).toBe('제출일시,상태,지원 동기,활동 가능 시간,메모');
  });

  it('지원자 데이터가 올바른 행으로 변환된다', () => {
    exportApplicantsToCSV(mockApplicants, mockQuestions, '테스트');
    const lines = capturedBlobContent.replace('\uFEFF', '').split('\n');
    expect(lines[1]).toContain('2024.03.15');
    expect(lines[1]).toContain('검토 전');
    expect(lines[1]).toContain('면접 일정 조율 필요');
  });

  it('질문 ID 기준으로 답변이 매핑된다', () => {
    exportApplicantsToCSV(mockApplicants, mockQuestions, '테스트');
    const lines = capturedBlobContent.replace('\uFEFF', '').split('\n');
    expect(lines[1]).toContain('동아리 활동을 통해 성장하고 싶습니다.');
    expect(lines[1]).toContain('주말 포함 매일');
  });

  it('질문에 해당하는 답변이 없으면 빈 값으로 처리된다', () => {
    const applicantWithMissingAnswer: Applicant[] = [
      { ...mockApplicants[0], answers: [{ id: 1, value: '지원 동기 답변' }] },
    ];
    exportApplicantsToCSV(applicantWithMissingAnswer, mockQuestions, '테스트');
    const lines = capturedBlobContent.replace('\uFEFF', '').split('\n');
    expect(lines[1]).toContain('지원 동기 답변');
    expect(lines[1]).toMatch(/지원 동기 답변,,/);
  });

  it('쉼표가 포함된 셀은 큰따옴표로 감싼다', () => {
    const applicantWithComma: Applicant[] = [
      {
        ...mockApplicants[0],
        answers: [
          { id: 1, value: '월, 화, 수' },
          { id: 2, value: '저녁' },
        ],
      },
    ];
    exportApplicantsToCSV(applicantWithComma, mockQuestions, '테스트');
    expect(capturedBlobContent).toContain('"월, 화, 수"');
  });

  it('큰따옴표가 포함된 셀은 이스케이프 처리된다', () => {
    const applicantWithQuote: Applicant[] = [
      {
        ...mockApplicants[0],
        answers: [
          { id: 1, value: '그는 "열정적"입니다' },
          { id: 2, value: '' },
        ],
      },
    ];
    exportApplicantsToCSV(applicantWithQuote, mockQuestions, '테스트');
    expect(capturedBlobContent).toContain('"그는 ""열정적""입니다"');
  });

  it('지원자가 없으면 헤더만 포함된다', () => {
    exportApplicantsToCSV([], mockQuestions, '테스트');
    const lines = capturedBlobContent.replace('\uFEFF', '').split('\n');
    expect(lines).toHaveLength(1);
    expect(lines[0]).toBe('제출일시,상태,지원 동기,활동 가능 시간,메모');
  });

  it('질문이 없으면 제출일시, 상태, 메모만 포함된다', () => {
    exportApplicantsToCSV(mockApplicants, [], '테스트');
    const lines = capturedBlobContent.replace('\uFEFF', '').split('\n');
    expect(lines[0]).toBe('제출일시,상태,메모');
  });
});

import { NAME_QUESTION_ID } from '@/constants/applicationForm';
import INITIAL_FORM_DATA from '@/constants/initialFormData';
import { ApplicationFormData, Question } from '@/types/application';
import { hasUserInput } from './hasUserInput';

const question = (id: number, title = ''): Question => ({
  id,
  title,
  description: '',
  type: 'SHORT_TEXT',
  options: { required: true },
  items: [],
});

const nameQuestion = INITIAL_FORM_DATA.questions!.find(
  (q) => q.id === NAME_QUESTION_ID,
)!;

const form = (questions: Question[]): ApplicationFormData => ({
  ...INITIAL_FORM_DATA,
  title: '',
  description: '',
  questions,
});

describe('hasUserInput', () => {
  it('기본 템플릿 그대로면 입력이 없다', () => {
    expect(hasUserInput(INITIAL_FORM_DATA)).toBe(false);
  });

  it('이름 질문을 아래로 옮겨도 이름 질문의 기본 제목은 입력으로 보지 않는다', () => {
    expect(hasUserInput(form([question(2), nameQuestion]))).toBe(false);
  });

  it('맨 앞 질문에 쓴 제목도 입력으로 본다', () => {
    expect(hasUserInput(form([question(2, '지원 동기'), nameQuestion]))).toBe(
      true,
    );
  });

  it('지원서 제목을 쓰면 입력이 있다', () => {
    expect(hasUserInput({ ...INITIAL_FORM_DATA, title: '신입 모집' })).toBe(
      true,
    );
  });
});

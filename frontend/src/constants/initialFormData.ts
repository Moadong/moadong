import { ApplicationFormData, ApplicationFormMode } from '@/types/application';
import { getSemesterTerm } from '@/utils/semester';

const INITIAL_FORM_DATA: ApplicationFormData = {
  title: '',
  description: '',
  questions: [
    //맨 처음은 이름
    {
      id: 1,
      title: '이름을 입력해주세요',
      description: '지원자의 이름을 입력해주세요. (예: 홍길동)',
      type: 'SHORT_TEXT',
      options: { required: true },
      items: [],
    },
    {
      id: 2,
      title: '',
      description: '',
      type: 'SHORT_TEXT',
      options: { required: true },
      items: [],
    },
    {
      id: 3,
      title: '',
      description: '',
      type: 'CHOICE',
      options: { required: true },
      items: [{ value: '' }, { value: '' }],
    },
  ],
  // now를 모듈 로드 시점에 한 번만 계산하면, 탭을 학기/연도 경계를 넘겨 오래 열어둘 때
  // stale 값이 전송될 수 있다. getter로 폼 초기화·제출 시점에 현재 날짜를 동적 계산한다.
  get semesterYear() {
    return new Date().getFullYear();
  },
  get semesterTerm() {
    return getSemesterTerm(new Date().getMonth());
  },
  formMode: ApplicationFormMode.INTERNAL,
  externalApplicationUrl: '',
  active: 'unpublished',
};

export default INITIAL_FORM_DATA;

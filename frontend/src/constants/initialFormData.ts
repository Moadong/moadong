import { ApplicationFormData, ApplicationFormMode } from '@/types/application';

const now = new Date();
const currentYear = now.getFullYear();
const currentMonth = now.getMonth();

// getMonth()는 0-indexed(1월=0 … 7월=6)이므로, 백엔드 학기 경계(1-indexed month < 7)와
// 동일하게 맞추려면 currentMonth < 6 (1~6월=FIRST, 7~12월=SECOND)이어야 한다.
const currentSemesterTerm = currentMonth < 6 ? 'FIRST' : 'SECOND';

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
  semesterYear: currentYear,
  semesterTerm: currentSemesterTerm,
  formMode: ApplicationFormMode.INTERNAL,
  externalApplicationUrl: '',
  active: 'unpublished',
};

export default INITIAL_FORM_DATA;

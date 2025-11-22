import { ApplicationFormData, ApplicationFormMode } from '@/types/application';

const now = new Date();
const currentYear = now.getFullYear();
const currentMonth = now.getMonth();

const currentSemesterTerm = currentMonth <= 6 ? 'FIRST' : 'SECOND';

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

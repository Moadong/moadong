import { NAME_QUESTION_ID } from '@/constants/applicationForm';
import { getApplicantName } from './getApplicantName';

describe('getApplicantName', () => {
  it('이름 질문이 몇 번째에 있든 그 질문의 답을 이름으로 쓴다', () => {
    const answers = [
      { id: 7, value: '20231234' },
      { id: NAME_QUESTION_ID, value: '홍길동' },
    ];

    expect(getApplicantName(answers)).toBe('홍길동');
  });

  it('이름 질문의 답이 없으면 undefined를 돌려준다', () => {
    expect(getApplicantName([{ id: 7, value: '20231234' }])).toBeUndefined();
  });
});

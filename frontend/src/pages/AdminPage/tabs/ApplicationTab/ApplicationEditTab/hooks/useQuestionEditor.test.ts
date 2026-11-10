import { renderHook } from '@testing-library/react';
import { NAME_QUESTION_ID } from '@/constants/applicationForm';
import { ApplicationFormData, ApplicationFormMode } from '@/types/application';
import { useQuestionEditor } from './useQuestionEditor';

const formData: ApplicationFormData = {
  title: '지원서',
  description: '',
  semesterYear: 2026,
  formMode: ApplicationFormMode.INTERNAL,
  questions: [
    {
      id: 2,
      title: '지원 동기',
      description: '',
      type: 'SHORT_TEXT',
      options: { required: false },
      items: [],
    },
    {
      id: NAME_QUESTION_ID,
      title: '이름',
      description: '',
      type: 'SHORT_TEXT',
      options: { required: true },
      items: [],
    },
  ],
};

/** setFormData에 들어온 갱신 함수를 formData에 적용한 결과. 호출되지 않았으면 undefined */
const applyUpdates = (
  act: (editor: ReturnType<typeof useQuestionEditor>) => void,
) => {
  const setFormData = jest.fn();
  const { result } = renderHook(() => useQuestionEditor(formData, setFormData));
  act(result.current);
  const updater = setFormData.mock.calls[0]?.[0];
  return updater ? (updater(formData) as ApplicationFormData) : undefined;
};

describe('useQuestionEditor', () => {
  it('이름 질문은 삭제·유형 변경·필수 변경을 해도 아무 일도 일어나지 않는다', () => {
    expect(
      applyUpdates((e) => e.removeQuestion(NAME_QUESTION_ID)),
    ).toBeUndefined();
    expect(
      applyUpdates((e) => e.handleTypeChange(NAME_QUESTION_ID)('LONG_TEXT')),
    ).toBeUndefined();
    expect(
      applyUpdates((e) => e.handleRequiredChange(NAME_QUESTION_ID)(false)),
    ).toBeUndefined();
  });

  it('다른 질문은 삭제·유형 변경·필수 변경이 된다', () => {
    expect(
      applyUpdates((e) => e.removeQuestion(2))?.questions?.map((q) => q.id),
    ).toEqual([NAME_QUESTION_ID]);
    expect(
      applyUpdates((e) => e.handleTypeChange(2)('LONG_TEXT'))?.questions?.[0]
        .type,
    ).toBe('LONG_TEXT');
    expect(
      applyUpdates((e) => e.handleRequiredChange(2)(true))?.questions?.[0]
        .options.required,
    ).toBe(true);
  });

  it('순서를 바꿔도 질문 id를 다시 매기지 않는다', () => {
    const reordered = [...formData.questions!].reverse();

    const result = applyUpdates((e) => e.handleReorder(reordered));

    expect(result?.questions?.map((q) => q.id)).toEqual([NAME_QUESTION_ID, 2]);
  });

  it('질문을 추가해도 기존 id는 그대로고 새 id는 기존과 겹치지 않는다', () => {
    const result = applyUpdates((e) => e.addQuestion());

    const ids = result?.questions?.map((q) => q.id) ?? [];
    expect(ids.slice(0, 2)).toEqual([2, NAME_QUESTION_ID]);
    expect(ids[2]).toBeGreaterThan(2);
  });
});

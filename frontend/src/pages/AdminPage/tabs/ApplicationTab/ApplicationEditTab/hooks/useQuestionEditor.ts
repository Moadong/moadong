import {
  ApplicationFormData,
  Question,
  QuestionType,
} from '@/types/application';
import { createQuestionId } from '../utils/createQuestionId';

/**
 * 지원서 질문 편집 동작. 데스크톱과 모바일 편집 화면이 같은 상태·같은 동작을 쓰도록 모아 둔다.
 * 질문 id는 저장된 응답과 이어지므로 어떤 동작에서도 다시 매기지 않는다.
 */
export const useQuestionEditor = (
  formData: ApplicationFormData,
  setFormData: React.Dispatch<React.SetStateAction<ApplicationFormData>>,
) => {
  const addQuestion = () => {
    const newQuestion: Question = {
      id: createQuestionId(formData.questions ?? []),
      title: '',
      description: '',
      type: 'SHORT_TEXT',
      items: [],
      options: { required: false },
    };
    setFormData((prev) => ({
      ...prev,
      questions: [...(prev.questions ?? []), newQuestion],
    }));
  };

  const handleReorder = (reordered: Question[]) => {
    setFormData((prev) => ({
      ...prev,
      questions: reordered,
    }));
  };

  const removeQuestion = (id: number) => {
    if (!formData.questions) return;
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions!.filter((q) => q.id !== id),
    }));
  };

  const updateQuestionField = <K extends keyof Question>(
    id: number,
    key: K,
    value: Question[K],
  ) => {
    if (!formData.questions) return;
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions!.map((q) =>
        q.id === id ? { ...q, [key]: value } : q,
      ),
    }));
  };

  const handleFormDescriptionChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      description: value,
    }));
  };

  const handleTitleChange = (id: number) => (value: string) =>
    updateQuestionField(id, 'title', value);

  const handleDescriptionChange = (id: number) => (value: string) =>
    updateQuestionField(id, 'description', value);

  const handleItemsChange = (id: number) => (items: { value: string }[]) =>
    updateQuestionField(id, 'items', items);

  const handleTypeChange = (id: number) => (newType: QuestionType) => {
    if (!formData.questions) return;
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions!.map((q) => {
        if (q.id !== id) return q;
        const isChoice = newType === 'CHOICE' || newType === 'MULTI_CHOICE';
        return {
          ...q,
          type: newType,
          items: isChoice
            ? q.items && q.items.length >= 1
              ? q.items
              : [{ value: '' }]
            : [],
        };
      }),
    }));
  };

  const handleRequiredChange = (id: number) => (value: boolean) => {
    if (!formData.questions) return;
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions!.map((q) =>
        q.id === id ? { ...q, options: { ...q.options, required: value } } : q,
      ),
    }));
  };

  return {
    addQuestion,
    handleReorder,
    removeQuestion,
    handleFormDescriptionChange,
    handleTitleChange,
    handleDescriptionChange,
    handleItemsChange,
    handleTypeChange,
    handleRequiredChange,
  };
};

// 지원서 제작하기 : 지원서 제작 컴포넌트
// 지원서 수정과 제작을 맡을 컴포넌트
// Todo: 질문 삭제 및 질문 추가 기능 구현
import { useState } from 'react';
import QuestionBuilder from '@/pages/AdminPage/application/components/QuestionBuilder/QuestionBuilder';
import { QuestionType } from '@/types/application';
import { Question } from '@/types/application';
import { mockData } from '@/mocks/data/mockData';
import { ApplicationFormData } from '@/types/application';
import { PageContainer } from '@/styles/PageContainer.styles';

const CreateForm = () => {
  const [formData, setFormData] = useState<ApplicationFormData>(mockData);

  const updateQuestionField = <K extends keyof Question>(
    id: number,
    key: K,
    value: Question[K],
  ) => {
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.id === id ? { ...q, [key]: value } : q,
      ),
    }));
  };

  const handleTitleChange = (id: number) => (value: string) =>
    updateQuestionField(id, 'title', value);

  const handleDescriptionChange = (id: number) => (value: string) =>
    updateQuestionField(id, 'description', value);

  const handleItemsChange = (id: number) => (items: { value: string }[]) =>
    updateQuestionField(id, 'items', items);

  const handleTypeChange = (id: number) => (newType: QuestionType) => {
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.map((q) => {
        if (q.id !== id) return q;
        const isChoice = newType === 'CHOICE' || newType === 'MULTI_CHOICE';
        return {
          ...q,
          type: newType,
          items: isChoice
            ? q.items && q.items.length >= 2
              ? q.items
              : [{ value: '' }, { value: '' }]
            : undefined,
        };
      }),
    }));
  };

  const handleRequiredChange = (id: number) => (value: boolean) => {
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.id === id ? { ...q, options: { ...q.options, required: value } } : q,
      ),
    }));
  };

  return (
    <>
      <PageContainer>
        {formData.questions.map((question) => (
          <QuestionBuilder
            key={question.id}
            id={question.id}
            title={question.title}
            description={question.description}
            options={question.options}
            items={question.items}
            type={question.type}
            onTitleChange={handleTitleChange(question.id)}
            onDescriptionChange={handleDescriptionChange(question.id)}
            onItemsChange={handleItemsChange(question.id)}
            onTypeChange={handleTypeChange(question.id)}
            onRequiredChange={handleRequiredChange(question.id)}
          />
        ))}
      </PageContainer>
    </>
  );
};

export default CreateForm;

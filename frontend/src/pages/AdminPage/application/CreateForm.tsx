// 지원서 제작하기 : 지원서 제작 컴포넌트
// 지원서 수정과 제작을 맡을 컴포넌트
// Todo: 질문 삭제 및 질문 추가 기능 구현
import { useState } from 'react';
import QuestionBuilder from '@/pages/AdminPage/application/components/QuestionBuilder/QuestionBuilder';

type QuestionType =
  | 'SHORT_TEXT'
  | 'LONG_TEXT'
  | 'CHOICE'
  | 'MULTI_CHOICE'
  | 'EMAIL'
  | 'PHONE_NUMBER'
  | 'NAME';

type Question = {
  title: string;
  description: string;
  type: QuestionType;
  options: {
    required: boolean;
  };
  items?: { value: string }[];
};

const CreateForm = () => {
  const [questions, setQuestions] = useState<Record<number, Question>>({
    1: {
      title: '이름을 입력해주세요',
      description: '본명을 입력해 주세요',
      options: {
        required: true,
      },
      type: 'SHORT_TEXT',
    },
    2: {
      title: '지원 분야를 선택해주세요',
      description: '중복 선택 가능합니다',
      options: {
        required: false,
      },
      items: [
        { value: '프론트엔드' },
        { value: '백엔드' },
        { value: '디자인' },
      ],
      type: 'MULTI_CHOICE',
    },
  });

  const handleTitleChange = (id: number) => (value: string) => {
    setQuestions((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        title: value,
      },
    }));
  };

  const handleDescriptionChange = (id: number) => (value: string) => {
    setQuestions((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        description: value,
      },
    }));
  };

  const handleItemsChange = (id: number) => (newItems: { value: string }[]) => {
    setQuestions((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        items: newItems,
      },
    }));
  };

  const handleTypeChange = (id: number) => (newType: QuestionType) => {
    setQuestions((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        options: {
          ...prev[id].options,
          required: value,
        },
      },
    }));
  };

  return (
    <>
      {Object.entries(questions).map(([id, question]) => (
        <QuestionBuilder
          key={id}
          id={Number(id)}
          title={question.title}
          description={question.description}
          required={question.options?.required ?? false}
          items={question.items}
          onTitleChange={handleTitleChange(Number(id))}
          onDescriptionChange={handleDescriptionChange(Number(id))}
          onItemsChange={handleItemsChange(Number(id))}
          onTypeChange={handleTypeChange(Number(id))}
          onRequiredChange={handleRequiredChange(Number(id))}
          type={question.type}
        />
      ))}
    </>
  );
};

export default CreateForm;

import { useState, useEffect, useRef } from 'react';
import QuestionBuilder from '@/pages/AdminPage/components/QuestionBuilder/QuestionBuilder';
import { QuestionType } from '@/types/application';
import { Question } from '@/types/application';
import { ApplicationFormData } from '@/types/application';
import { PageContainer } from '@/styles/PageContainer.styles';
import * as Styled from './ApplicationEditTab.styles';
import INITIAL_FORM_DATA from '@/constants/INITIAL_FORM_DATA';
import { QuestionDivider } from './ApplicationEditTab.styles';
import { useAdminClubContext } from '@/context/AdminClubContext';
import { useGetApplication } from '@/hooks/queries/application/useGetApplication';
import createApplication from '@/apis/application/createApplication';
import updateApplication from '@/apis/application/updateApplication';

const ApplicationEditTab = () => {
  const { clubId } = useAdminClubContext();
  if (!clubId) return null;

  const { data, isLoading, isError } = useGetApplication(clubId);

  const [formData, setFormData] =
    useState<ApplicationFormData>(INITIAL_FORM_DATA);

  const [description, setDescription] = useState('');
  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (data) {
      setFormData(data);
    }
  }, [data]);

  const [nextId, setNextId] = useState(() => {
    const questions = data?.questions ?? INITIAL_FORM_DATA.questions;
    if (questions.length === 0) return 1;
    const maxId = Math.max(...questions.map((q: Question) => q.id));
    return maxId + 1;
  });

  const addQuestion = () => {
    const newQuestion: Question = {
      id: nextId,
      title: '',
      description: '',
      type: 'SHORT_TEXT',
      items: [],
      options: { required: false },
    };
    setFormData((prev) => ({
      ...prev,
      questions: [...prev.questions, newQuestion],
    }));
    setNextId((currentId) => currentId + 1);
  };

  const removeQuestion = (id: number) => {
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.filter((q) => q.id !== id),
    }));
  };

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

  const handleFormTitleChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      title: value,
    }));
  };

  const handleFormDescriptionChange = (value: string) => {
    setDescription(value);
    if (descriptionRef.current) {
      descriptionRef.current.style.height = 'auto';
      descriptionRef.current.style.height =
        descriptionRef.current.scrollHeight + 'px';
    }
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
            ? q.items && q.items.length >= 1
              ? q.items
              : [{ value: '' }]
            : [],
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

  const handleSubmit = async () => {
    if (!clubId) return;
    const reorderedQuestions = formData.questions.map((q, idx) => ({
      ...q,
      id: idx + 1,
    }));

    const payload: ApplicationFormData = {
      ...formData,
      questions: reorderedQuestions,
    };
    try {
      if (data) {
        await updateApplication(payload, clubId);
        alert('지원서가 성공적으로 수정되었습니다.');
      } else {
        await createApplication(payload, clubId);
        alert('지원서가 성공적으로 생성되었습니다.');
      }
    } catch (error) {
      alert('지원서 저장에 실패했습니다.');
      console.error(error);
    }
  };

  return (
    <>
      <PageContainer>
        <Styled.FormTitle
          type='text'
          value={formData.title}
          onChange={(e) => handleFormTitleChange(e.target.value)}
          placeholder='지원서 제목을 입력하세요'
        ></Styled.FormTitle>
        <Styled.FormDescription
          ref={descriptionRef}
          value={description}
          onInput={(e) => handleFormDescriptionChange(e.currentTarget.value)}
          placeholder='지원서 설명을 입력하세요'
        ></Styled.FormDescription>
        <Styled.QuestionContainer>
          {formData.questions.map((question, index) => (
            <QuestionBuilder
              key={question.id}
              id={index + 1}
              title={question.title}
              description={question.description}
              options={question.options}
              items={question.items}
              type={question.type}
              readOnly={index === 0} //인덱스 0번은 이름을 위한 고정 부분이므로 수정 불가
              onTitleChange={handleTitleChange(question.id)}
              onDescriptionChange={handleDescriptionChange(question.id)}
              onItemsChange={handleItemsChange(question.id)}
              onTypeChange={handleTypeChange(question.id)}
              onRequiredChange={handleRequiredChange(question.id)}
              onRemoveQuestion={() => removeQuestion(question.id)}
            />
          ))}
        </Styled.QuestionContainer>
        <QuestionDivider />
        <Styled.AddQuestionButton onClick={addQuestion}>
          질문 추가 +
        </Styled.AddQuestionButton>
        <Styled.ButtonWrapper>
          <Styled.submitButton onClick={handleSubmit}>
            저장하기
          </Styled.submitButton>
        </Styled.ButtonWrapper>
      </PageContainer>
    </>
  );
};

export default ApplicationEditTab;

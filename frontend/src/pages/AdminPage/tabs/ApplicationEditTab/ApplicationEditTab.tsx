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
import { createApplication } from '@/apis/application/createApplication';
import { updateApplication } from '@/apis/application/updateApplication';
import CustomTextArea from '@/components/common/CustomTextArea/CustomTextArea';
import { APPLICATION_FORM } from '@/constants/APPLICATION_FORM';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';

const ApplicationEditTab = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { clubId } = useAdminClubContext();
  const { formId } = useParams<{ formId: string }>();
  if (!clubId) return null;

  const { data:existingFormData, isLoading, isError, error} = useGetApplication(clubId, formId ?? '');

  const [formData, setFormData] =
    useState<ApplicationFormData>(INITIAL_FORM_DATA);

  const [nextId, setNextId] = useState(1);
  useEffect(() => {
    if (existingFormData) {
      setFormData(existingFormData);

      const questions = existingFormData.questions;
      if (questions.length > 0) {
        const maxId = Math.max(...questions.map((q: Question) => q.id));
        setNextId(maxId + 1);
      }
    }
  }, [existingFormData]);

  const {mutate: createMutate, isPending: isCreating} = useMutation({
    mutationFn: (payload: ApplicationFormData) => createApplication(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['allApplicationForms']});
      alert('지원서가 성공적으로 생성되었습니다.');
      navigate(`/admin/applicants`);
    },
    onError: (err:Error) => alert(`지원서 생성에 실패했습니다.: ${err.message}`),
  });

  const { mutate: updateMutate, isPending: isUpdating } = useMutation({
    mutationFn: ({ data, applicationFormId }: { data: ApplicationFormData; applicationFormId: string }) => 
      updateApplication(data, applicationFormId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allApplicationForms'] });
      queryClient.invalidateQueries({ queryKey: ['applicationForm', formId] });
      alert('지원서가 성공적으로 수정되었습니다.');
      navigate('/admin/applicants');
    },
    onError: (err: Error) => alert(`지원서 수정에 실패했습니다: ${err.message}`),
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

    const payload = {
      ...formData,
      questions: reorderedQuestions,
    };
    if (formId) {
      updateMutate({
        data: payload,
        applicationFormId: formId,
    });
    } else {
      createMutate(payload);
    }
  };

  if (isLoading) {
    return <div>지원서 정보를 불러오는 중...</div>;
  }
  if (isError) {
    return <div>지원서 정보를 불러오는데 실패했습니다. {error.message}</div>;
  }

  return (
    <>
      <PageContainer>
        <Styled.FormTitle
          type='text'
          value={formData.title}
          onChange={(e) => handleFormTitleChange(e.target.value)}
          placeholder='지원서 제목을 입력하세요'
        ></Styled.FormTitle>
        <CustomTextArea
          label="지원서 설명"
          value={formData.description}
          onChange={(e) => handleFormDescriptionChange(e.target.value)}
          placeholder={APPLICATION_FORM.APPLICATION_DESCRIPTION.placeholder}
          maxLength={APPLICATION_FORM.APPLICATION_DESCRIPTION.maxLength}
          showMaxChar
          width="100%"
        />
        <Styled.QuestionContainer  >
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

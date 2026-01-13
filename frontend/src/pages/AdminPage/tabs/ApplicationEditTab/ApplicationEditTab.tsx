import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createApplication } from '@/apis/application/createApplication';
import { updateApplication } from '@/apis/application/updateApplication';
import Button from '@/components/common/Button/Button';
import CustomTextArea from '@/components/common/CustomTextArea/CustomTextArea';
import { APPLICATION_FORM } from '@/constants/APPLICATION_FORM';
import INITIAL_FORM_DATA from '@/constants/INITIAL_FORM_DATA';
import { useAdminClubContext } from '@/context/AdminClubContext';
import { useGetApplication } from '@/hooks/queries/application/useGetApplication';
import QuestionBuilder from '@/pages/AdminPage/components/QuestionBuilder/QuestionBuilder';
import { PageContainer } from '@/styles/PageContainer.styles';
import {
  ApplicationFormData,
  ApplicationFormMode,
  Question,
  QuestionType,
} from '@/types/application';
import * as Styled from './ApplicationEditTab.styles';
import { QuestionDivider } from './ApplicationEditTab.styles';

const externalApplicationUrlAllowed = [
  'https://forms.gle',
  'https://docs.google.com/forms',
  'https://form.naver.com',
  'https://naver.me',
  'https://everytime.kr',
];

const ApplicationEditTab = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { applicationFormId: formId } = useParams<{
    applicationFormId?: string;
  }>();
  const { clubId } = useAdminClubContext();

  const {
    data: existingFormData,
    isLoading,
    isError,
    error,
  } = useGetApplication(clubId ?? undefined, formId ?? '');

  const [formData, setFormData] =
    useState<ApplicationFormData>(INITIAL_FORM_DATA);
  const [nextId, setNextId] = useState(1);
  const [applicationFormMode, setApplicationFormMode] =
    useState<ApplicationFormMode>(ApplicationFormMode.INTERNAL);
  const [externalApplicationUrl, setExternalApplicationUrl] = useState('');

  useEffect(() => {
    if (!existingFormData) return;

    const {
      formMode = ApplicationFormMode.INTERNAL,
      externalApplicationUrl = '',
      questions = [],
    } = existingFormData;

    const currentQuestions =
      questions.length > 0 ? questions : INITIAL_FORM_DATA.questions!;

    setApplicationFormMode(formMode);
    setExternalApplicationUrl(externalApplicationUrl);
    setNextId(Math.max(...currentQuestions.map((q) => q.id)) + 1);
    setFormData({ ...existingFormData, questions: currentQuestions });
  }, [existingFormData]);

  const { mutate: createMutate, isPending: isCreating } = useMutation({
    mutationFn: (payload: ApplicationFormData) => createApplication(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allApplicationForms'] });
      alert('지원서가 성공적으로 생성되었습니다.');
      navigate(`/admin/application-list`);
    },
    onError: (err: Error) =>
      alert(`지원서 생성에 실패했습니다.: ${err.message}`),
  });

  const { mutate: updateMutate, isPending: isUpdating } = useMutation({
    mutationFn: ({
      data,
      applicationFormId,
    }: {
      data: ApplicationFormData;
      applicationFormId: string;
    }) => updateApplication(data, applicationFormId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allApplicationForms'] });
      queryClient.invalidateQueries({
        queryKey: ['applicationForm', clubId, formId],
      });
      alert('지원서가 성공적으로 수정되었습니다.');
      navigate('/admin/application-list');
    },
    onError: (err: Error) =>
      alert(`지원서 수정에 실패했습니다: ${err.message}`),
  });

  const handleFormTitleChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      title: value,
    }));
  };

  if (!clubId) return <div>클럽 정보가 없습니다.</div>;

  if (isLoading) {
    return <div>지원서 정보를 불러오는 중...</div>;
  }
  if (isError) {
    return <div>지원서 정보를 불러오는데 실패했습니다. {error.message}</div>;
  }

  const handleSubmit = async () => {
    if (!clubId) return;
    const reorderedQuestions = formData.questions?.map((q, idx) => ({
      ...q,
      id: idx + 1,
    }));

    const payload: ApplicationFormData = {
      title: formData.title,
      description: formData.description,
      semesterYear: formData.semesterYear,
      semesterTerm: formData.semesterTerm,
      formMode: applicationFormMode,
      active: formData.active ?? '',
    };

    if (applicationFormMode === ApplicationFormMode.INTERNAL) {
      payload.questions = reorderedQuestions;
    } else if (applicationFormMode === ApplicationFormMode.EXTERNAL) {
      const isValidUrl = externalApplicationUrlAllowed.some((url) =>
        externalApplicationUrl.startsWith(url),
      );

      if (!isValidUrl) {
        alert(
          '외부 지원서 링크는 Google Forms, Naver Form 또는 Everytime 링크여야 합니다.',
        );
        return;
      }

      payload.externalApplicationUrl = externalApplicationUrl;
    }

    if (formId) {
      updateMutate({
        data: payload,
        applicationFormId: formId,
      });
    } else {
      createMutate(payload);
    }
  };

  return (
    <>
      <PageContainer>
        <Styled.HeaderContainer>
          <Styled.ChangeButtonWrapper>
            <Styled.ApplicationFormChangeButton
              $active={applicationFormMode === ApplicationFormMode.INTERNAL}
              onClick={() =>
                setApplicationFormMode(ApplicationFormMode.INTERNAL)
              }
            >
              모아동지원서
            </Styled.ApplicationFormChangeButton>
            <Styled.ApplicationFormChangeButton
              $active={applicationFormMode === ApplicationFormMode.EXTERNAL}
              onClick={() =>
                setApplicationFormMode(ApplicationFormMode.EXTERNAL)
              }
            >
              외부지원서
            </Styled.ApplicationFormChangeButton>
          </Styled.ChangeButtonWrapper>
        </Styled.HeaderContainer>
        <Styled.FormTitle
          type='text'
          value={formData.title}
          onChange={(e) => handleFormTitleChange(e.target.value)}
          placeholder='지원서 제목을 입력하세요'
        ></Styled.FormTitle>
        {applicationFormMode === ApplicationFormMode.INTERNAL ? (
          <InternalApplicationComponent
            formData={formData}
            setFormData={setFormData}
            nextId={nextId}
            setNextId={setNextId}
          />
        ) : (
          <ExternalApplicationComponent
            externalApplicationUrl={externalApplicationUrl}
            setExternalApplicationUrl={setExternalApplicationUrl}
          />
        )}
        <Styled.ButtonWrapper>
          <Button width={'150px'} animated onClick={handleSubmit}>
            저장하기
          </Button>
        </Styled.ButtonWrapper>
      </PageContainer>
    </>
  );
};

interface InternalApplicationComponentProps {
  formData: ApplicationFormData;
  setFormData: React.Dispatch<React.SetStateAction<ApplicationFormData>>;
  nextId: number;
  setNextId: React.Dispatch<React.SetStateAction<number>>;
}

const InternalApplicationComponent = ({
  formData,
  setFormData,
  nextId,
  setNextId,
}: InternalApplicationComponentProps) => {
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
      questions: [...(prev.questions ?? []), newQuestion],
    }));
    setNextId((currentId) => currentId + 1);
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

  return (
    <>
      <CustomTextArea
        label='지원서 설명'
        value={formData.description}
        onChange={(e) => handleFormDescriptionChange(e.target.value)}
        placeholder={APPLICATION_FORM.APPLICATION_DESCRIPTION.placeholder}
        maxLength={APPLICATION_FORM.APPLICATION_DESCRIPTION.maxLength}
        showMaxChar
        width='100%'
      />
      <Styled.QuestionContainer>
        {formData.questions?.map((question, index) => (
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
    </>
  );
};

const ExternalApplicationComponent = ({
  externalApplicationUrl,
  setExternalApplicationUrl,
}: {
  externalApplicationUrl: string;
  setExternalApplicationUrl: React.Dispatch<React.SetStateAction<string>>;
}) => {
  return (
    <>
      <Styled.ExternalApplicationFormContainer>
        <Styled.ExternalApplicationFormTitle>
          링크
        </Styled.ExternalApplicationFormTitle>
        <Styled.ExternalApplicationFormLinkInput
          placeholder='https://~~'
          value={externalApplicationUrl}
          onChange={(e) => setExternalApplicationUrl(e.target.value)}
        />
      </Styled.ExternalApplicationFormContainer>
      <Styled.ExternalApplicationFormHint>
        현재 구글폼, 네이버폼, 에브리타임 링크만 제출가능합니다.
      </Styled.ExternalApplicationFormHint>
    </>
  );
};

export default ApplicationEditTab;

import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Reorder } from 'framer-motion';
import {
  createApplication,
  generateApplicationDraft,
  updateApplication,
} from '@/apis/application';
import Button from '@/components/common/Button/Button';
import CustomTextArea from '@/components/common/CustomTextArea/CustomTextArea';
import Spinner from '@/components/common/Spinner/Spinner';
import {
  APPLICATION_FORM,
  NAME_QUESTION_ID,
} from '@/constants/applicationForm';
import { ADMIN_EVENT } from '@/constants/eventName';
import INITIAL_FORM_DATA from '@/constants/initialFormData';
import { queryKeys } from '@/constants/queryKeys';
import { ApiError } from '@/errors';
import useMixpanelTrack from '@/hooks/Mixpanel/useMixpanelTrack';
import {
  useAiDraftQuota,
  useGetApplication,
} from '@/hooks/Queries/useApplication';
import LongPressReorderItem from '@/pages/AdminPage/components/LongPressReorderItem/LongPressReorderItem';
import QuestionBuilder from '@/pages/AdminPage/components/QuestionBuilder/QuestionBuilder';
import {
  hasErrors,
  validateApplicationForm,
} from '@/pages/AdminPage/validation/validateApplicationForm';
import { useAdminClubId } from '@/store/useAdminClubStore';
import { PageContainer } from '@/styles/PageContainer.styles';
import {
  ApplicationFormData,
  ApplicationFormMode,
  Question,
  QuestionType,
} from '@/types/application';
import * as Styled from './ApplicationEditTab.styles';
import { QuestionDivider } from './ApplicationEditTab.styles';
import { createQuestionId } from './utils/createQuestionId';
import { hasUserInput } from './utils/hasUserInput';

const ApplicationEditTab = () => {
  const { applicationFormId: formId } = useParams<{
    applicationFormId?: string;
  }>();
  const { clubId } = useAdminClubId();

  const {
    data: existingFormData,
    isLoading,
    isError,
    error,
  } = useGetApplication(clubId ?? undefined, formId ?? '');

  if (!clubId) return <div>클럽 정보가 없습니다.</div>;

  if (isLoading) {
    return <div>지원서 정보를 불러오는 중...</div>;
  }
  if (isError) {
    return <div>지원서 정보를 불러오는데 실패했습니다. {error.message}</div>;
  }

  // 편집 state는 지원서가 준비된 뒤 마운트할 때 한 번만 초깃값으로 정한다.
  // 같은 지원서를 다시 불러와도 편집 중인 내용을 덮어쓰지 않고, 다른 지원서로 가면 새로 마운트한다.
  return (
    <ApplicationEditor
      key={`${clubId}:${formId ?? 'new'}`}
      clubId={clubId}
      formId={formId}
      initialFormData={existingFormData}
    />
  );
};

const toEditableFormData = (
  savedFormData: ApplicationFormData | undefined,
): ApplicationFormData => {
  if (!savedFormData) return INITIAL_FORM_DATA;
  const questions = savedFormData.questions ?? [];
  return {
    ...savedFormData,
    questions: questions.length > 0 ? questions : INITIAL_FORM_DATA.questions!,
  };
};

interface ApplicationEditorProps {
  clubId: string;
  formId: string | undefined;
  /** 수정할 저장된 지원서. 새 지원서면 undefined */
  initialFormData: ApplicationFormData | undefined;
}

const ApplicationEditor = ({
  clubId,
  formId,
  initialFormData,
}: ApplicationEditorProps) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const trackEvent = useMixpanelTrack();

  const [formData, setFormData] = useState<ApplicationFormData>(() =>
    toEditableFormData(initialFormData),
  );
  const [applicationFormMode, setApplicationFormMode] =
    useState<ApplicationFormMode>(
      initialFormData?.formMode ?? ApplicationFormMode.INTERNAL,
    );
  const [externalApplicationUrl, setExternalApplicationUrl] = useState(
    initialFormData?.externalApplicationUrl ?? '',
  );

  const isDraftButtonVisible =
    !formId && applicationFormMode === ApplicationFormMode.INTERNAL;
  const { data: draftQuota } = useAiDraftQuota(clubId, isDraftButtonVisible);
  // 생성 성공/429로 갱신된 값을 즉시 반영 (quota 조회 전·실패 시에도 동작)
  const [remainingOverride, setRemainingOverride] = useState<number>();
  const remaining = remainingOverride ?? draftQuota?.remaining;
  const isDraftLimitReached = remaining === 0;
  // 저장된 지원서가 AI 초안에서 출발했는지 구분한다
  const [draftSource, setDraftSource] = useState<'manual' | 'ai' | 'template'>(
    'manual',
  );

  const isDraftButtonViewTracked = useRef(false);
  useEffect(() => {
    if (!isDraftButtonVisible || isDraftButtonViewTracked.current) return;
    isDraftButtonViewTracked.current = true;
    trackEvent(ADMIN_EVENT.AI_DRAFT_BUTTON_VIEWED);
  }, [isDraftButtonVisible, trackEvent]);

  const { mutate: createMutate, isPending: isCreating } = useMutation({
    mutationFn: (payload: ApplicationFormData) => createApplication(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.application.all });
      trackEvent(ADMIN_EVENT.APPLICATION_FORM_SAVED, {
        is_edit: false,
        form_mode: applicationFormMode,
        draft_source: draftSource,
      });
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
      queryClient.invalidateQueries({ queryKey: queryKeys.application.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.application.detail(clubId, formId ?? ''),
      });
      trackEvent(ADMIN_EVENT.APPLICATION_FORM_SAVED, {
        is_edit: true,
        form_mode: applicationFormMode,
        draft_source: draftSource,
      });
      alert('지원서가 성공적으로 수정되었습니다.');
      navigate('/admin/application-list');
    },
    onError: (err: Error) =>
      alert(`지원서 수정에 실패했습니다: ${err.message}`),
  });

  const { mutate: generateDraft, isPending: isGenerating } = useMutation({
    mutationFn: generateApplicationDraft,
    onSuccess: (draft) => {
      if (!draft) return;
      const nameQuestion = { ...INITIAL_FORM_DATA.questions![0] };
      const draftQuestions = draft.questions.map((q, index) => ({
        ...q,
        id: index + 2, // id 1은 이름 질문(NAME_QUESTION_ID)이 쓴다
      }));
      setFormData((prev) => ({
        ...prev,
        title: draft.title,
        description: draft.description,
        questions: [nameQuestion, ...draftQuestions],
      }));
      setDraftSource(draft.aiGenerated ? 'ai' : 'template');
      trackEvent(ADMIN_EVENT.AI_DRAFT_GENERATED, {
        ai_generated: draft.aiGenerated,
        question_count: draftQuestions.length,
        remaining: draft.remaining,
      });
      if (typeof draft.remaining === 'number') {
        setRemainingOverride(draft.remaining);
      }
      if (!draft.aiGenerated) {
        alert(
          'AI 생성에 실패해 기본 템플릿을 제공했어요. 질문을 직접 다듬어주세요.',
        );
      }
    },
    onError: (err: Error) => {
      if (err instanceof ApiError && err.status === 429) {
        setRemainingOverride(0);
        trackEvent(ADMIN_EVENT.AI_DRAFT_LIMIT_REACHED);
        alert('이번 달 AI 초안 생성 횟수(3회)를 모두 사용했어요.');
        return;
      }
      trackEvent(ADMIN_EVENT.AI_DRAFT_GENERATION_FAILED, {
        status: err instanceof ApiError ? err.status : undefined,
        message: err.message,
      });
      alert(`지원서 초안 생성에 실패했습니다: ${err.message}`);
    },
  });

  const handleGenerateDraft = () => {
    const isOverwriting = hasUserInput(formData);
    trackEvent(ADMIN_EVENT.AI_DRAFT_BUTTON_CLICKED, {
      has_user_input: isOverwriting,
      remaining,
    });
    if (
      isOverwriting &&
      !confirm('작성 중인 내용을 AI 초안으로 덮어씁니다. 계속할까요?')
    ) {
      trackEvent(ADMIN_EVENT.AI_DRAFT_OVERWRITE_CANCELED);
      return;
    }
    generateDraft();
  };

  const handleFormTitleChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      title: value,
    }));
  };

  const handleSubmit = async () => {
    const validationErrors = validateApplicationForm(
      formData,
      applicationFormMode,
      externalApplicationUrl,
    );
    if (hasErrors(validationErrors)) {
      const messages: string[] = [
        ...(validationErrors.title ? [validationErrors.title] : []),
        ...(validationErrors.description ? [validationErrors.description] : []),
        ...Object.values(validationErrors.questions ?? {}),
        ...(validationErrors.externalUrl ? [validationErrors.externalUrl] : []),
      ];
      alert(messages.join('\n'));
      return;
    }

    const payload: ApplicationFormData = {
      title: formData.title,
      description: formData.description,
      semesterYear: formData.semesterYear,
      formMode: applicationFormMode,
    };

    if (applicationFormMode === ApplicationFormMode.INTERNAL) {
      payload.questions = formData.questions;
    } else if (applicationFormMode === ApplicationFormMode.EXTERNAL) {
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
      {isGenerating && (
        <Styled.AiLoadingOverlay>
          <Spinner height='auto' />
          <Styled.AiLoadingText>지원서 자동 생성 중...</Styled.AiLoadingText>
        </Styled.AiLoadingOverlay>
      )}
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
          {isDraftButtonVisible && (
            <Styled.AiDraftActions>
              {typeof remaining === 'number' && (
                <Styled.AiDraftRemaining>
                  이번 달 {remaining}회 남음
                </Styled.AiDraftRemaining>
              )}
              <Styled.AiDraftButton
                onClick={handleGenerateDraft}
                disabled={isGenerating || isDraftLimitReached}
                title={
                  isDraftLimitReached
                    ? '이번 달 AI 초안 생성 횟수(3회)를 모두 사용했어요.'
                    : undefined
                }
              >
                ✨ AI로 초안 생성
              </Styled.AiDraftButton>
            </Styled.AiDraftActions>
          )}
        </Styled.HeaderContainer>
        <Styled.FormTitle
          type='text'
          maxLength={50}
          value={formData.title}
          onChange={(e) => handleFormTitleChange(e.target.value)}
          placeholder='지원서 제목을 입력하세요'
        ></Styled.FormTitle>
        {applicationFormMode === ApplicationFormMode.INTERNAL ? (
          <InternalApplicationComponent
            formData={formData}
            setFormData={setFormData}
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
}

const InternalApplicationComponent = ({
  formData,
  setFormData,
}: InternalApplicationComponentProps) => {
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

  const renderQuestionBuilder = (question: Question, index: number) => (
    <QuestionBuilder
      id={index + 1}
      title={question.title}
      description={question.description}
      options={question.options}
      items={question.items}
      type={question.type}
      // 이름 질문은 순서만 바꿀 수 있고 수정·삭제할 수 없다
      readOnly={question.id === NAME_QUESTION_ID}
      onTitleChange={handleTitleChange(question.id)}
      onDescriptionChange={handleDescriptionChange(question.id)}
      onItemsChange={handleItemsChange(question.id)}
      onTypeChange={handleTypeChange(question.id)}
      onRequiredChange={handleRequiredChange(question.id)}
      onRemoveQuestion={() => removeQuestion(question.id)}
    />
  );

  return (
    <>
      <CustomTextArea
        variant='filled'
        label='지원서 설명'
        value={formData.description}
        onChange={(e) => handleFormDescriptionChange(e.target.value)}
        placeholder={APPLICATION_FORM.APPLICATION_DESCRIPTION.placeholder}
        maxLength={APPLICATION_FORM.APPLICATION_DESCRIPTION.maxLength}
        showMaxChar
        width='100%'
      />
      <Styled.QuestionContainer
        as={Reorder.Group<Question[]>}
        forwardedAs='div'
        axis='y'
        values={formData.questions ?? []}
        onReorder={handleReorder}
      >
        {formData.questions?.map((question, index) => (
          <LongPressReorderItem key={question.id} value={question}>
            {renderQuestionBuilder(question, index)}
          </LongPressReorderItem>
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

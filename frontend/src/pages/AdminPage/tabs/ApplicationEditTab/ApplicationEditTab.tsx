import { useState, useEffect } from 'react';
import { QuestionType } from '@/types/application';
import { Question } from '@/types/application';
import { ApplicationFormData } from '@/types/application';
import INITIAL_FORM_DATA from '@/constants/INITIAL_FORM_DATA';
import { useAdminClubContext } from '@/context/AdminClubContext';
import { useGetApplication } from '@/hooks/queries/application/useGetApplication';
import { createApplication } from '@/apis/application/createApplication';
import { updateApplication } from '@/apis/application/updateApplication';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import useIsMobileView from '@/hooks/useIsMobileView';
import DesktopApplicationEditTab from './DesktopApplicationEditTab';
import MobileApplicationEditTab from './MobileApplicationEditTab';

const ApplicationEditTab = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { clubId, applicationFormId: formId } = useAdminClubContext();
  const isMobile = useIsMobileView();

  const {
    data: existingFormData,
    isLoading,
    isError,
    error,
  } = useGetApplication(clubId ?? undefined, formId ?? '');

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

  if (!clubId) return <div>클럽 정보가 없습니다.</div>;

  if (isLoading) {
    return <div>지원서 정보를 불러오는 중...</div>;
  }
  if (isError) {
    return <div>지원서 정보를 불러오는데 실패했습니다. {error.message}</div>;
  }

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
      active: formData.active ?? '',
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

  const props = {
    formData,
    handleFormTitleChange,
    handleFormDescriptionChange,
    handleTitleChange,
    handleDescriptionChange,
    handleItemsChange,
    handleTypeChange,
    handleRequiredChange,
    removeQuestion,
    addQuestion,
    handleSubmit,
  };

  return isMobile ? (
    <MobileApplicationEditTab {...props} />
  ) : (
    <DesktopApplicationEditTab {...props} />
  );
};

export default ApplicationEditTab;

import { useEffect, useRef, useState } from 'react';
import { PageContainer } from '@/styles/PageContainer.styles';
import Header from '@/components/common/Header/Header';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetClubDetail } from '@/hooks/queries/club/useGetClubDetail';
import { useAnswers } from '@/hooks/useAnswers';
import QuestionAnswerer from '@/pages/ApplicationFormPage/components/QuestionAnswerer/QuestionAnswerer';
import { useGetApplication } from '@/hooks/queries/application/useGetApplication';
import { Question } from '@/types/application';
import Spinner from '@/components/common/Spinner/Spinner';
import applyToClub from '@/apis/application/applyToClub';
import QuestionContainer from '@/pages/ApplicationFormPage/components/QuestionContainer/QuestionContainer';
import { parseDescriptionWithLinks } from '@/utils/parseDescriptionWithLinks';
import { validateAnswers } from '@/hooks/useValidateAnswers';
import * as Styled from './ApplicationFormPage.styles';

const ApplicationFormPage = () => {
  const { clubId } = useParams<{ clubId: string }>();
  const navigate = useNavigate();
  const questionRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [invalidQuestionIds, setInvalidQuestionIds] = useState<number[]>([]);

  if (!clubId) return null;

  const STORAGE_KEY = `applicationAnswers_${clubId}`;
  const saved = localStorage.getItem(STORAGE_KEY);
  const initialAnswers = saved ? JSON.parse(saved) : [];

  const {
    onAnswerChange: rawOnAnswerChange,
    getAnswersById,
    answers,
  } = useAnswers(initialAnswers);

  const { data: clubDetail, error: clubError } = useGetClubDetail(clubId);
  const {
    data: formData,
    isLoading,
    isError,
    error: applicationError,
  } = useGetApplication(clubId);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
  }, [answers]);

  if (isLoading) return <Spinner />;
  if (isError || clubError) {
    alert(applicationError?.message || '문제가 발생했어요.');
    navigate(`/club/${clubId}`);
    return null;
  }
  if (!formData || !clubDetail) {
    return (
      <div>
        지원서 정보를 불러오지 못했어요. 새로고침하거나 잠시 후 다시 시도해
        주세요.
      </div>
    );
  }

  const onAnswerChange = (id: number, value: string | string[]) => {
    rawOnAnswerChange(id, value);

    const isEmpty =
      (Array.isArray(value) && value.every((v) => v.trim() === '')) ||
      (!Array.isArray(value) && value.trim() === '');

    if (!isEmpty && invalidQuestionIds.includes(id)) {
      setInvalidQuestionIds((prev) => prev.filter((qid) => qid !== id));
    }
  };

  const handleScrollToInvalid = (invalidIds: number[]) => {
    const firstInvalidIndex = formData.questions.findIndex((q: Question) =>
      invalidIds.includes(q.id),
    );
    const targetEl = questionRefs.current[firstInvalidIndex];
    targetEl?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleSubmit = async () => {
    const invalidIds = validateAnswers(formData.questions, getAnswersById);
    if (invalidIds.length > 0) {
      setInvalidQuestionIds(invalidIds);
      handleScrollToInvalid(invalidIds);
      return;
    }

    try {
      await applyToClub(clubId, answers);
      localStorage.removeItem(STORAGE_KEY);
      alert(
        `"${clubDetail.name}" 동아리에 성공적으로 지원되었습니다.\n좋은 결과 있으시길 바랍니다🤗`,
      );
      navigate(`/club/${clubId}`);
    } catch {
      alert(
        '⚠️ 답변 제출에 실패했어요.\n네트워크 상태를 확인하거나 잠시 후 다시 시도해 주세요.',
      );
    }
  };

  return (
    <>
      <Header />
      <PageContainer style={{ paddingTop: '80px' }}>
        <Styled.FormTitle>{formData.title}</Styled.FormTitle>
        {formData.description && (
          <Styled.FormDescription>
            {parseDescriptionWithLinks(formData.description)}
          </Styled.FormDescription>
        )}
        <Styled.QuestionsWrapper>
          {formData.questions.map((q: Question, i: number) => (
            <QuestionContainer
              key={q.id}
              hasError={invalidQuestionIds.includes(q.id)}
              ref={(el: HTMLDivElement | null) => {
                questionRefs.current[i] = el;
              }}
            >
              <QuestionAnswerer
                question={q}
                selectedAnswers={getAnswersById(q.id)}
                onChange={onAnswerChange}
              />
            </QuestionContainer>
          ))}
        </Styled.QuestionsWrapper>

        <Styled.ButtonWrapper>
          <Styled.submitButton onClick={handleSubmit}>
            제출하기
          </Styled.submitButton>
        </Styled.ButtonWrapper>
      </PageContainer>
    </>
  );
};

export default ApplicationFormPage;

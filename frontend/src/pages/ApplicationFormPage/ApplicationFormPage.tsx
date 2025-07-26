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

const AnswerApplicationForm = () => {
  const { clubId } = useParams<{ clubId: string }>();
  const navigate = useNavigate();
  const questionRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [invalidQuestionIds, setInvalidQuestionIds] = useState<number[]>([]);

  // ===== 1. 유효성: clubId가 없을 경우 =====
  if (!clubId) return null;

  // ===== 2. 로컬스토리지 초기값 불러오기 =====
  const STORAGE_KEY = `applicationAnswers_${clubId}`;
  const saved = localStorage.getItem(STORAGE_KEY);
  const initialAnswers = saved ? JSON.parse(saved) : [];

  // ===== 3. useAnswers 훅 =====
  const {
    onAnswerChange: rawOnAnswerChange,
    getAnswersById,
    answers,
  } = useAnswers(initialAnswers);

  // ===== 4. 쿼리 호출 =====
  const { data: clubDetail, error: clubError } = useGetClubDetail(clubId);
  const {
    data: formData,
    isLoading,
    isError,
    error: applicationError,
  } = useGetApplication(clubId);

  // ===== 5. 자동 저장 =====
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
  }, [answers]);

  // ===== 6. 로딩/에러 처리 =====
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

  // ===== 7. 핸들러 =====
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
      alert('답변이 성공적으로 제출되었습니다.');
    } catch {
      alert('답변 제출에 실패했습니다. 잠시 후 다시 시도해 주세요.');
    }
  };

  // ===== 8. 렌더 =====
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

export default AnswerApplicationForm;

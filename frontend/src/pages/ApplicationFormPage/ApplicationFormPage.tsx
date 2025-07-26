import { useState, useRef } from 'react';
import { PageContainer } from '@/styles/PageContainer.styles';
import Header from '@/components/common/Header/Header';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetClubDetail } from '@/hooks/queries/club/useGetClubDetail';
//import ClubProfile from '@/pages/ClubDetailPage/components/ClubProfile/ClubProfile';
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

  const {
    onAnswerChange: rawOnAnswerChange,
    getAnswersById,
    answers,
  } = useAnswers();
  const { data: clubDetail, error: clubError } = useGetClubDetail(clubId ?? '');

  const {
    data: formData,
    isLoading,
    isError,
    error: applicationError,
  } = useGetApplication(clubId ?? '');

  if (!clubId) return null;
  if (isLoading) return <Spinner />;

  const onAnswerChange = (id: number, value: string | string[]) => {
    rawOnAnswerChange(id, value);

    // 입력이 생겼다면 해당 질문의 오류 제거
    const isEmpty =
      (Array.isArray(value) && value.every((v) => v.trim() === '')) ||
      (!Array.isArray(value) && value.trim() === '');

    if (!isEmpty && invalidQuestionIds.includes(id)) {
      setInvalidQuestionIds((prev) => prev.filter((qid) => qid !== id));
    }
  };

  const handleScrollToInvalid = (invalidIds: number[]) => {
    const firstInvalidIndex = formData?.questions.findIndex((q: Question) =>
      invalidIds.includes(q.id),
    );
    const targetEl =
      firstInvalidIndex !== undefined
        ? questionRefs.current[firstInvalidIndex]
        : null;
    targetEl?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleSubmit = async () => {
    if (!formData) return;

    const invalidIds = validateAnswers(formData.questions, getAnswersById);

    if (invalidIds.length > 0) {
      setInvalidQuestionIds(invalidIds);
      handleScrollToInvalid(invalidIds);
      return;
    }

    try {
      await applyToClub(clubId!, answers);
      alert('답변이 성공적으로 제출되었습니다.');
    } catch {
      alert('답변 제출에 실패했습니다. 잠시 후 다시 시도해 주세요.');
    }
  };

  if (!clubId) return null;
  if (isLoading) return <Spinner />;
  if (isError || clubError) {
    alert(applicationError?.message || '문제가 발생했어요.');
    navigate(`/club/${clubId}`);
    return <div>문제가 발생했어요. 잠시 후 다시 시도해 주세요.</div>;
  }
  if (!formData || !clubDetail) {
    return (
      <div>
        지원서 정보를 불러오지 못했어요. 새로고침하거나 잠시 후 다시 시도해
        주세요.
      </div>
    );
  }

  return (
    <>
      <Header />
      <PageContainer style={{ paddingTop: '80px' }}>
        {/* <ClubProfile
                    name={clubDetail.name}
                    logo={clubDetail.logo}
                    division={clubDetail.division}
                    category={clubDetail.category}
                    tags={clubDetail.tags}
                /> */}
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

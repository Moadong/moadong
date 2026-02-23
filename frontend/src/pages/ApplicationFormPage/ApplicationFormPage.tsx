import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { applyToClub } from '@/apis/application';
import Footer from '@/components/common/Footer/Footer';
import Header from '@/components/common/Header/Header';
import Spinner from '@/components/common/Spinner/Spinner';
import { PAGE_VIEW, USER_EVENT } from '@/constants/eventName';
import { useAnswers } from '@/hooks/Application/useAnswers';
import useMixpanelTrack from '@/hooks/Mixpanel/useMixpanelTrack';
import useTrackPageView from '@/hooks/Mixpanel/useTrackPageView';
import { useGetApplication } from '@/hooks/Queries/useApplication';
import { useGetClubDetail } from '@/hooks/Queries/useClub';
import QuestionAnswerer from '@/pages/ApplicationFormPage/components/QuestionAnswerer/QuestionAnswerer';
import QuestionContainer from '@/pages/ApplicationFormPage/components/QuestionContainer/QuestionContainer';
import { PageContainer } from '@/styles/PageContainer.styles';
import { Question } from '@/types/application';
import { linkifyText } from '@/utils/linkifyText';
import { validateAnswers } from '@/utils/useValidateAnswers';
import * as Styled from './ApplicationFormPage.styles';

const ApplicationFormPage = () => {
  const { clubId, applicationFormId } = useParams<{
    clubId: string;
    applicationFormId: string;
  }>();
  const navigate = useNavigate();
  const questionRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [invalidQuestionIds, setInvalidQuestionIds] = useState<number[]>([]);
  const trackEvent = useMixpanelTrack();

  if (!clubId || !applicationFormId) return null;

  const { data: clubDetail, error: clubError } = useGetClubDetail(clubId);
  const {
    data: formData,
    isLoading,
    isError,
    error: applicationError,
  } = useGetApplication(clubId, applicationFormId);

  useTrackPageView(
    PAGE_VIEW.APPLICATION_FORM_PAGE,
    clubDetail?.name ?? `club:${clubId ?? 'unknown'}`,
  );

  const STORAGE_KEY = `applicationAnswers_${clubId}_${applicationFormId}`;
  const saved = localStorage.getItem(STORAGE_KEY);
  const initialAnswers = saved ? JSON.parse(saved) : [];

  const {
    onAnswerChange: rawOnAnswerChange,
    getAnswersById,
    answers,
  } = useAnswers(initialAnswers);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
  }, [answers, clubId, applicationFormId]);

  if (isLoading) return <Spinner />;
  if (isError || clubError) {
    alert(applicationError?.message || '문제가 발생했어요.');
    navigate(`/clubDetail/@${clubDetail?.name}`);
    return null;
  }
  if (!formData || !clubDetail || !formData.questions) {
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
    const firstInvalidIndex = formData.questions!.findIndex((q: Question) =>
      invalidIds.includes(q.id),
    );
    const targetEl = questionRefs.current[firstInvalidIndex];
    targetEl?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleSubmit = async () => {
    trackEvent(USER_EVENT.APPLICATION_FORM_SUBMITTED, {
      club_id: clubId,
      club_name: clubDetail?.name,
    });

    const invalidIds = validateAnswers(formData.questions!, getAnswersById);
    if (invalidIds.length > 0) {
      setInvalidQuestionIds(invalidIds);
      handleScrollToInvalid(invalidIds);
      return;
    }

    try {
      await applyToClub(clubId, applicationFormId, answers);
      localStorage.removeItem(STORAGE_KEY);
      alert(
        `"${clubDetail.name}" 동아리에 성공적으로 지원되었습니다.\n좋은 결과 있으시길 바랍니다`,
      );
      navigate(`/clubDetail/@${clubDetail.name}`, { replace: true });
    } catch (error) {
      alert(
        '답변 제출에 실패했어요.\n네트워크 상태를 확인하거나 잠시 후 다시 시도해 주세요.',
      );
    }
  };

  return (
    <>
      <Header showOn={['desktop', 'laptop']} />
      <PageContainer>
        <Styled.FormTitle>{formData.title}</Styled.FormTitle>
        {formData.description && (
          <Styled.FormDescription>
            {linkifyText(formData.description)}
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
          <Styled.SubmitButton onClick={handleSubmit} animated={true}>
            제출하기
          </Styled.SubmitButton>
        </Styled.ButtonWrapper>
      </PageContainer>
      <Footer />
    </>
  );
};

export default ApplicationFormPage;

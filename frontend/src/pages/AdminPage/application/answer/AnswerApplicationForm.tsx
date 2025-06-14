import { PageContainer } from '@/styles/PageContainer.styles';
import * as Styled from './AnswerApplicationForm.styles';
import Header from '@/components/common/Header/Header';
import { useParams } from 'react-router-dom';
import { useGetClubDetail } from '@/hooks/queries/club/useGetClubDetail';
import ClubProfile from '@/pages/ClubDetailPage/components/ClubProfile/ClubProfile';
import { useAnswers } from '@/hooks/useAnswers';
import QuestionAnswerer from '@/pages/AdminPage/application/components/QuestionAnswerer/QuestionAnswerer';
import { useGetApplication } from '@/hooks/queries/application/useGetApplication';
import { Question } from '@/types/application';
import Spinner from '@/components/common/Spinner/Spinner';

const AnswerApplicationForm = () => {
  const { clubId } = useParams<{ clubId: string }>();
  if (!clubId) return null;

  const { data: clubDetail, error } = useGetClubDetail(clubId);
  const { data: formData, isLoading, isError } = useGetApplication(clubId);

  const { onAnswerChange, getAnswersById } = useAnswers();

  if (isLoading) return <Spinner />;

  if (error || isError) {
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
      <PageContainer style={{ paddingTop: '172px' }}>
        <ClubProfile
          name={clubDetail.name}
          logo={clubDetail.logo}
          division={clubDetail.division}
          category={clubDetail.category}
          tags={clubDetail.tags}
        />
        <Styled.FormTitle>{formData.title}</Styled.FormTitle>
        <Styled.QuestionsWrapper>
          {formData.questions.map((q: Question) => (
            <QuestionAnswerer
              key={q.id}
              question={q}
              selectedAnswers={getAnswersById(q.id)}
              onChange={onAnswerChange}
            />
          ))}
        </Styled.QuestionsWrapper>
        <Styled.ButtonWrapper>
          <Styled.submitButton>제출하기</Styled.submitButton>
        </Styled.ButtonWrapper>
      </PageContainer>
    </>
  );
};

export default AnswerApplicationForm;

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

const AnswerApplicationForm = () => {
  const { clubId } = useParams<{ clubId: string }>();
  const { data: clubDetail, error } = useGetClubDetail(clubId || '');
  const {
    data: formData,
    isLoading,
    isError,
  } = useGetApplication(clubId || '');
  if (!clubId) return null;
  if (!clubDetail) return null;
  const { onAnswerChange, getAnswersById } = useAnswers();

  if (!clubId || isLoading || !formData || !clubDetail) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>에러가 발생했습니다.</div>;
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

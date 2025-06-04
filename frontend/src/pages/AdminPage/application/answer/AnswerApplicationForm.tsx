import { mockData } from '@/mocks/data/mockData';
import { PageContainer } from '@/styles/PageContainer.styles';
import * as Styled from './AnswerApplicationForm.styles';
import Header from '@/components/common/Header/Header';
import { useParams } from 'react-router-dom';
import { useGetClubDetail } from '@/hooks/queries/club/useGetClubDetail';
import ClubProfile from '@/pages/ClubDetailPage/components/ClubProfile/ClubProfile';
import { useAnswers } from '@/hooks/useAnswers';
import QuestionAnswerer from '@/pages/AdminPage/application/components/QuestionAnswerer/QuestionAnswerer';

const AnswerApplicationForm = () => {
  //ToDO: useParams를 사용하여 clubId를 동적으로 가져오도록 수정
  const { clubId } = useParams<{ clubId: string }>();
  const { data: clubDetail, error } = useGetClubDetail(clubId || '');
  const { onAnswerChange, getAnswersById } = useAnswers();
  if (!clubDetail) {
    return null;
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
        <Styled.FormTitle>{mockData.form_title}</Styled.FormTitle>
        <Styled.QuestionsWrapper>
          {mockData.questions.map((q) => (
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

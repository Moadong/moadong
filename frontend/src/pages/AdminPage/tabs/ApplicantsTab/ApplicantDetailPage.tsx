import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAdminClubContext } from '@/context/AdminClubContext';
import Header from '@/components/common/Header/Header';
import { PageContainer } from '@/styles/PageContainer.styles';
import * as Styled from '@/pages/ApplicationFormPage/ApplicationFormPage.styles';
import QuestionContainer from '@/pages/ApplicationFormPage/components/QuestionContainer/QuestionContainer';
import QuestionAnswerer from '@/pages/ApplicationFormPage/components/QuestionAnswerer/QuestionAnswerer';
import { useGetApplication } from '@/hooks/queries/application/useGetApplication';
import Spinner from '@/components/common/Spinner/Spinner';
import backButtonIcon from '@/assets/images/icons/back_button_icon.svg';


const ApplicantDetailPage = () => {
  const { questionId } = useParams<{ questionId: string }>();
  const navigate = useNavigate();
  const { applicantsData, clubId } = useAdminClubContext();

  // 지원서 질문 목록 fetch
  const { data: formData, isLoading, isError } = useGetApplication(clubId!);

  if (!applicantsData) {
    return <div>지원자 데이터를 불러올 수 없습니다.</div>;
  }
  if (isLoading) return <Spinner />;
  if (isError || !formData) return <div>지원서 정보를 불러올 수 없습니다.</div>;

  // questionId로 지원자 찾기
  const applicant = applicantsData.applicants.find(
    (a) => a.id === questionId
  );
  if (!applicant) {
    return <div>해당 지원자를 찾을 수 없습니다.</div>;
  }

  // 답변 매핑 함수
  const getAnswerByQuestionId = (qId: number) => {
    return applicant.answers
      .filter((ans) => ans.id === qId)
      .map((ans) => ans.value);
  };

  return (
    <>
      <Header />
      <PageContainer style={{ paddingTop: '80px' }}>
        {/* FormTitle과 백아이콘을 한 줄에 배치 */}
        <div
          style={{
            position: 'sticky',
            top: 25,
            zIndex: 10,
            background: '#fff',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            marginBottom: 16,
          }}
        >
          <button
            onClick={() => navigate(-1)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            aria-label="뒤로가기"
          >
            <img src={backButtonIcon} alt="뒤로가기" style={{ width: 16, height: 16 }} />
          </button>
        </div>
        {/* 커서 고정 */}
        <Styled.QuestionsWrapper style={{ cursor: 'default' }}>
          {formData.questions.map((q: import('@/types/application').Question, i: number) => (
            <QuestionContainer key={q.id} hasError={false}>
              <QuestionAnswerer
                question={q}
                selectedAnswers={getAnswerByQuestionId(q.id)}
                onChange={() => {}}
              />
            </QuestionContainer>
          ))}
        </Styled.QuestionsWrapper>
      </PageContainer>
    </>
  );
};

export default ApplicantDetailPage; 
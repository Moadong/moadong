import React, { useEffect, useMemo, useState } from 'react';
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
import debounce from '@/utils/debounce';
import updateApplicantMemo from '@/apis/application/updateApplicantDetail';
import { ApplicationStatus } from '@/types/applicants';
import mapStatusToGroup from '@/utils/mapStatusToGroup';

const AVAILABLE_STATUSES = [
  ApplicationStatus.SCREENING, // 서류검토
  ApplicationStatus.INTERVIEW_SCHEDULED, // 면접예정
  ApplicationStatus.ACCEPTED, // 합격
];

const ApplicantDetailPage = () => {
  const { questionId } = useParams<{ questionId: string }>();
  const navigate = useNavigate();
  const [applicantMemo, setAppMemo] = useState('');
  const [applicantStatus, setApplicantStatus] = useState<ApplicationStatus>();
  const { applicantsData, clubId } = useAdminClubContext();

  const { data: formData, isLoading, isError } = useGetApplication(clubId!);

  const applicant = useMemo(
    () => applicantsData?.applicants.find((a) => a.id === questionId),
    [applicantsData, questionId],
  );

  useEffect(() => {
    if (applicant) {
      setAppMemo(applicant.memo);
      setApplicantStatus(mapStatusToGroup(applicant.status).status);
    }
  }, [applicant]);

  const updateApplicantDetail = useMemo(
    () =>
      debounce((memo: any, status: any) => {
        updateApplicantMemo(memo as string, status as ApplicationStatus, clubId!, questionId!);
      }, 400),
    [clubId, questionId],
  );

  if (!applicantsData) {
    return <div>지원자 데이터를 불러올 수 없습니다.</div>;
  }
  if (isLoading) return <Spinner />;
  if (isError || !formData) return <div>지원서 정보를 불러올 수 없습니다.</div>;

  // questionId로 지원자 찾기
  if (!applicant) {
    return <div>해당 지원자를 찾을 수 없습니다.</div>;
  }

  // 답변 매핑 함수
  const getAnswerByQuestionId = (qId: number) => {
    return applicant.answers
      .filter((ans) => ans.id === qId)
      .map((ans) => ans.value);
  };


  const handleMemoChange = (e: any) => {
    const newMemo = e.target.value;
    setAppMemo(newMemo);
    updateApplicantDetail(newMemo, applicantStatus);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as ApplicationStatus;
    setApplicantStatus(newStatus);
    updateApplicantDetail(applicantMemo, newStatus);
  };

  return (
    <>
      <Header />
      <PageContainer style={{ paddingTop: '80px' }}>
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
        <textarea onInput={handleMemoChange} placeholder='메모를 입력해주세요' value={applicantMemo}></textarea>

        <select id="statusSelect" value={applicantStatus} onChange={handleStatusChange}>
          {AVAILABLE_STATUSES.map((status) => (
            <option key={status} value={status}>
              {mapStatusToGroup(status).label}
            </option>
          ))}
        </select>

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
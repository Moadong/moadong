import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import NextApplicantButton from '@/assets/images/icons/next_applicant.svg';
import PrevApplicantButton from '@/assets/images/icons/prev_applicant.svg';
import Header from '@/components/common/Header/Header';
import Spinner from '@/components/common/Spinner/Spinner';
import { AVAILABLE_STATUSES } from '@/constants/status';
import useDevice from '@/hooks/useDevice';
import QuestionAnswerer from '@/pages/ApplicationFormPage/components/QuestionAnswerer/QuestionAnswerer';
import QuestionContainer from '@/pages/ApplicationFormPage/components/QuestionContainer/QuestionContainer';
import { ApplicationStatus } from '@/types/applicants';
import { Question } from '@/types/application';
import mapStatusToGroup from '@/utils/mapStatusToGroup';
import * as Styled from './ApplicantDetailPage.styles';
import ApplicantDetailPageMobile from './ApplicantDetailPageMobile';
import { useApplicantDetail } from './hooks/useApplicantDetail';

const getStatusColor = (status: ApplicationStatus | undefined): string => {
  switch (status) {
    case ApplicationStatus.ACCEPTED:
      return 'var(--f5, #F5F5F5)';
    case ApplicationStatus.SUBMITTED:
      return '#E5F6FF';
    case ApplicationStatus.INTERVIEW_SCHEDULED:
      return '#E9FFF1';
    case ApplicationStatus.DECLINED:
      return '#FFE8E8';
    default:
      return 'var(--f5, #F5F5F5)';
  }
};

const isApplicationStatus = (value: unknown): value is ApplicationStatus => {
  return (
    typeof value === 'string' &&
    Object.values(ApplicationStatus).includes(value as ApplicationStatus)
  );
};

const ApplicantDetailPage = () => {
  const { questionId, applicationFormId } = useParams<{
    questionId: string;
    applicationFormId: string;
  }>();
  const navigate = useNavigate();
  const { isMobile, isTablet } = useDevice();

  const {
    applicantsData,
    isApplicantsLoading,
    isApplicantsError,
    formData,
    isLoading,
    isError,
    applicant,
    applicantIndex,
    applicantMemo,
    setApplicantMemo,
    applicantStatus,
    setApplicantStatus,
    updateApplicantDetail,
    getAnswerByQuestionId,
  } = useApplicantDetail(applicationFormId, questionId);

  if (!applicationFormId) return <div>지원서 정보를 불러올 수 없습니다.</div>;
  if (isLoading || isApplicantsLoading) return <Spinner />;
  if (isApplicantsError)
    return <div>지원자 데이터를 불러오는 중 오류가 발생했습니다.</div>;
  if (!applicantsData) return <div>지원자 데이터를 불러올 수 없습니다.</div>;
  if (isError) return <div>지원서 정보를 불러오는 중 오류가 발생했습니다.</div>;
  if (!formData) return <div>지원서 정보가 없습니다.</div>;
  if (!applicant) return <div>해당 지원자를 찾을 수 없습니다.</div>;

  const handlePrev = () => {
    const prev = applicantsData.applicants[applicantIndex - 1];
    if (!prev) return;
    navigate(`/admin/applicants-list/${applicationFormId}/${prev.id}`);
  };

  const handleNext = () => {
    const next = applicantsData.applicants[applicantIndex + 1];
    if (!next) return;
    navigate(`/admin/applicants-list/${applicationFormId}/${next.id}`);
  };

  const handleStatusChange = (status: ApplicationStatus) => {
    setApplicantStatus(status);
    updateApplicantDetail(applicantMemo, status);
  };

  const handleMemoBlur = () => {
    updateApplicantDetail(applicantMemo, applicantStatus);
  };

  if (isMobile || isTablet) {
    return (
      <ApplicantDetailPageMobile
        applicantsData={applicantsData}
        formData={formData}
        applicantIndex={applicantIndex}
        applicantMemo={applicantMemo}
        setApplicantMemo={setApplicantMemo}
        applicantStatus={applicantStatus}
        onStatusChange={handleStatusChange}
        onMemoBlur={handleMemoBlur}
        onPrev={handlePrev}
        onNext={handleNext}
        onSelect={(id) =>
          navigate(`/admin/applicants-list/${applicationFormId}/${id}`)
        }
        onBack={() => navigate(`/admin/applicants-list/${applicationFormId}`)}
        getAnswerByQuestionId={getAnswerByQuestionId}
      />
    );
  }

  return (
    <>
      <Header />
      <Styled.Wrapper>
        <Styled.HeaderContainer>
          <Styled.ApplicantContainer>
            <Styled.NavigationButton
              onClick={handlePrev}
              src={PrevApplicantButton}
              alt='이전 지원자'
            />
            <select
              id='applicantSelect'
              value={applicant.id}
              onChange={(e) =>
                navigate(
                  `/admin/applicants-list/${applicationFormId}/${e.target.value}`,
                )
              }
            >
              {applicantsData.applicants.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.answers[0].value}
                </option>
              ))}
            </select>
            <Styled.NavigationButton
              onClick={handleNext}
              src={NextApplicantButton}
              alt='다음 지원자'
            />
          </Styled.ApplicantContainer>
          <Styled.StatusSelect
            id='statusSelect'
            value={applicantStatus}
            onChange={(e) => {
              const rawStatus = e.target.value;
              if (!isApplicationStatus(rawStatus)) return;
              handleStatusChange(rawStatus);
            }}
            $backgroundColor={getStatusColor(applicantStatus)}
          >
            {AVAILABLE_STATUSES.map((status) => (
              <option key={status} value={status}>
                {mapStatusToGroup(status).label}
              </option>
            ))}
          </Styled.StatusSelect>
        </Styled.HeaderContainer>

        <Styled.MemoContainer>
          <Styled.MemoLabel>메모</Styled.MemoLabel>
          <Styled.MemoTextarea
            onChange={(e) => setApplicantMemo(e.target.value)}
            onBlur={handleMemoBlur}
            placeholder='메모를 입력해주세요'
            value={applicantMemo}
          />
        </Styled.MemoContainer>
      </Styled.Wrapper>

      <Styled.ApplicantInfoContainer>
        <Styled.QuestionsWrapper style={{ cursor: 'default' }}>
          {formData.questions?.map((q: Question, i: number) => (
            <QuestionContainer key={q.id} hasError={false}>
              <QuestionAnswerer
                question={q}
                selectedAnswers={getAnswerByQuestionId(q.id)}
                onChange={() => {}}
              />
            </QuestionContainer>
          ))}
        </Styled.QuestionsWrapper>
      </Styled.ApplicantInfoContainer>
    </>
  );
};

export default ApplicantDetailPage;

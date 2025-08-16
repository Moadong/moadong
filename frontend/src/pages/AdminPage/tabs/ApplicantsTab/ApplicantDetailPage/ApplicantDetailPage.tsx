import React, { useEffect, useMemo, useState } from 'react';
import * as Styled from './ApplicantDetailPage.styles';
import { useParams, useNavigate } from 'react-router-dom';
import { useAdminClubContext } from '@/context/AdminClubContext';
import Header from '@/components/common/Header/Header';
import QuestionContainer from '@/pages/ApplicationFormPage/components/QuestionContainer/QuestionContainer';
import QuestionAnswerer from '@/pages/ApplicationFormPage/components/QuestionAnswerer/QuestionAnswerer';
import Spinner from '@/components/common/Spinner/Spinner';
import debounce from '@/utils/debounce';
import updateApplicantMemo from '@/apis/application/updateApplicantDetail';
import { useGetApplication } from '@/hooks/queries/application/useGetApplication';
import { ApplicationStatus } from '@/types/applicants';
import mapStatusToGroup from '@/utils/mapStatusToGroup';
import { Question } from '@/types/application';
import PrevApplicantButton from '@/assets/images/icons/prev_applicant.svg';
import NextApplicantButton from '@/assets/images/icons/next_applicant.svg';

const AVAILABLE_STATUSES = [
  ApplicationStatus.SCREENING, // 서류검토 (SUBMITTED 포함)
  ApplicationStatus.INTERVIEW_SCHEDULED, // 면접예정
  ApplicationStatus.ACCEPTED, // 합격
] as const;

const getStatusColor = (status: ApplicationStatus | undefined): string => {
  switch (status) {
    case ApplicationStatus.ACCEPTED:
      return 'var(--f5, #F5F5F5)';
    case ApplicationStatus.SCREENING:
    case ApplicationStatus.SUBMITTED:
      return '#E5F6FF';
    case ApplicationStatus.INTERVIEW_SCHEDULED:
      return '#E9FFF1';
    default:
      return 'var(--f5, #F5F5F5)';
  }
};

const ApplicantDetailPage = () => {
  const { questionId } = useParams<{ questionId: string }>();
  const navigate = useNavigate();
  const [applicantMemo, setAppMemo] = useState('');
  const [applicantStatus, setApplicantStatus] = useState<ApplicationStatus>();
  const { applicantsData, clubId, setApplicantsData } = useAdminClubContext();

  const { data: formData, isLoading, isError } = useGetApplication(clubId!);

  const { applicant, applicantIndex } = useMemo(() => {
    const index =
      applicantsData?.applicants.findIndex((a) => a.id === questionId) ?? -1;
    const _applicant = applicantsData?.applicants[index];

    return { applicant: _applicant, applicantIndex: index };
  }, [applicantsData, questionId]);

  useEffect(() => {
    if (applicant) {
      setAppMemo(applicant.memo);
      setApplicantStatus(mapStatusToGroup(applicant.status).status);
    }
  }, [applicant]);

  const updateApplicantDetail = useMemo(
    () =>
      debounce((memo: any, status: any) => {
        updateApplicantMemo(
          memo as string,
          status as ApplicationStatus,
          clubId!,
          questionId!,
        );
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

  const updateApplicantInContext = (
    memo: string,
    status: ApplicationStatus,
  ) => {
    if (!applicantsData || applicantIndex === -1) return;

    const updatedApplicants = [...applicantsData.applicants];
    updatedApplicants[applicantIndex] = { ...applicant, memo, status };

    setApplicantsData({ ...applicantsData, applicants: updatedApplicants });
  };

  const handleMemoChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newMemo = e.target.value;
    setAppMemo(newMemo);
    updateApplicantInContext(newMemo, applicantStatus!);
    updateApplicantDetail(newMemo, applicantStatus);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as ApplicationStatus;
    setApplicantStatus(newStatus);
    updateApplicantInContext(applicantMemo, newStatus);
    updateApplicantDetail(applicantMemo, newStatus);
  };

  const previousApplicant = () => {
    const previousData = applicantsData.applicants[applicantIndex - 1];
    if (applicantIndex < 0 || !previousData) return;

    navigate(`/admin/applicants/${previousData.id}`);
  };

  const nextApplicant = () => {
    const nextData = applicantsData.applicants[applicantIndex + 1];
    if (applicantIndex < 0 || !nextData) return;

    navigate(`/admin/applicants/${nextData.id}`);
  };

  return (
    <>
      <Header />
      <Styled.Wrapper>
        <Styled.HeaderContainer>
          <Styled.ApplicantContainer>
            <Styled.NavigationButton
              onClick={previousApplicant}
              src={PrevApplicantButton}
              alt='이전 지원자'
            />
            <select
              id='applicantSelect'
              value={applicant.id}
              onChange={(e) => navigate(`/admin/applicants/${e.target.value}`)}
            >
              {applicantsData.applicants.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.answers[0].value}
                </option>
              ))}
            </select>
            <Styled.NavigationButton
              onClick={nextApplicant}
              src={NextApplicantButton}
              alt='다음 지원자'
            />
          </Styled.ApplicantContainer>
          <Styled.StatusSelect
            id='statusSelect'
            value={applicantStatus}
            onChange={handleStatusChange}
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
            onInput={handleMemoChange}
            placeholder='메모를 입력해주세요'
            value={applicantMemo}
          ></Styled.MemoTextarea>
        </Styled.MemoContainer>
      </Styled.Wrapper>

      <Styled.QuestionsWrapper style={{ cursor: 'default' }}>
        {formData.questions.map((q: Question, i: number) => (
          <QuestionContainer key={q.id} hasError={false}>
            <QuestionAnswerer
              question={q}
              selectedAnswers={getAnswerByQuestionId(q.id)}
              onChange={() => {}}
            />
          </QuestionContainer>
        ))}
      </Styled.QuestionsWrapper>
    </>
  );
};

export default ApplicantDetailPage;

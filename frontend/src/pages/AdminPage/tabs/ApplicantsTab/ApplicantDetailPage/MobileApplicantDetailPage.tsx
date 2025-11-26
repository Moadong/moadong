import React from 'react';
import * as Styled from './ApplicantDetailPage.styles';
import { NavigateFunction } from 'react-router-dom';
import Header from '@/components/common/Header/Header';
import QuestionContainer from '@/pages/ApplicationFormPage/components/QuestionContainer/QuestionContainer';
import QuestionAnswerer from '@/pages/ApplicationFormPage/components/QuestionAnswerer/QuestionAnswerer';
import { ApplicationStatus } from '@/types/applicants';
import { Question } from '@/types/application';
import PrevApplicantButton from '@/assets/images/icons/prev_applicant.svg';
import NextApplicantButton from '@/assets/images/icons/next_applicant.svg';
import mapStatusToGroup from '@/utils/mapStatusToGroup';
import { AVAILABLE_STATUSES } from '@/constants/status';

interface ApplicantDetailPageProps {
  applicant: any;
  applicantsData: any;
  applicantMemo: string;
  handleMemoChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  applicantStatus: ApplicationStatus;
  handleStatusChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  getStatusColor: (status: ApplicationStatus | undefined) => string;
  previousApplicant: () => void;
  nextApplicant: () => void;
  navigate: NavigateFunction;
  formData: any;
  getAnswerByQuestionId: (qId: number) => string[];
}

const MobileApplicantDetailPage = ({
  applicant,
  applicantsData,
  applicantMemo,
  handleMemoChange,
  applicantStatus,
  handleStatusChange,
  getStatusColor,
  previousApplicant,
  nextApplicant,
  navigate,
  formData,
  getAnswerByQuestionId,
}: ApplicantDetailPageProps) => {
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
              onChange={(e) =>
                navigate(`/admin/applicants-list/${e.target.value}`)
              }
            >
              {applicantsData.applicants.map((a: any) => (
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

      <Styled.ApplicantInfoContainer>
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
      </Styled.ApplicantInfoContainer>
    </>
  );
};

export default MobileApplicantDetailPage;

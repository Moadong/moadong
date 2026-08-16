import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Spinner from '@/components/common/Spinner/Spinner';
import WebviewTopBar from '@/components/common/WebviewTopBar/WebviewTopBar';
import { AVAILABLE_STATUSES } from '@/constants/status';
import {
  useGetApplicants,
  useUpdateApplicant,
} from '@/hooks/Queries/useApplicants';
import { useGetApplication } from '@/hooks/Queries/useApplication';
import { useAdminClubId } from '@/store/useAdminClubStore';
import { ApplicationStatus } from '@/types/applicants';
import { Question } from '@/types/application';
import { asApplicantId } from '@/types/branded';
import mapStatusToGroup from '@/utils/mapStatusToGroup';
import * as Styled from './ApplicantDetailPageMobile.styles';
import AnswerCard from './components/mobile/AnswerCard/AnswerCard';
import ApplicantNavHeader from './components/mobile/ApplicantNavHeader/ApplicantNavHeader';

const ApplicantDetailPageMobile = () => {
  const { questionId, applicationFormId } = useParams<{
    questionId: string;
    applicationFormId: string;
  }>();
  const navigate = useNavigate();

  const [applicantMemo, setApplicantMemo] = useState('');
  const [applicantStatus, setApplicantStatus] = useState<ApplicationStatus>(
    ApplicationStatus.SUBMITTED,
  );

  const { clubId } = useAdminClubId();

  const {
    data: applicantsData,
    isLoading: isApplicantsLoading,
    isError: isApplicantsError,
  } = useGetApplicants(applicationFormId ?? undefined);

  const applicantIndex =
    applicantsData?.applicants.findIndex((a) => a.id === questionId) ?? -1;
  const applicant = applicantsData?.applicants[applicantIndex];

  const {
    data: formData,
    isLoading,
    isError,
  } = useGetApplication(clubId!, applicationFormId ?? undefined);

  const { mutate: updateApplicant } = useUpdateApplicant(
    applicationFormId ?? undefined,
  );

  useEffect(() => {
    if (applicant) {
      setApplicantMemo(applicant.memo);
      setApplicantStatus(mapStatusToGroup(applicant.status).status);
    }
  }, [applicant, applicant?.status, applicant?.memo]);

  const updateApplicantDetail = (memo: string, status: ApplicationStatus) => {
    if (!questionId) return;
    updateApplicant(
      [{ memo, status, applicantId: asApplicantId(questionId) }],
      { onError: () => alert('지원자 정보 수정에 실패했습니다.') },
    );
  };

  const handlePrev = () => {
    const prev = applicantsData?.applicants[applicantIndex - 1];
    if (!prev) return;
    navigate(`/admin/applicants-list/${applicationFormId}/${prev.id}`);
  };

  const handleNext = () => {
    const next = applicantsData?.applicants[applicantIndex + 1];
    if (!next) return;
    navigate(`/admin/applicants-list/${applicationFormId}/${next.id}`);
  };

  const handleSelectApplicant = (id: string) => {
    navigate(`/admin/applicants-list/${applicationFormId}/${id}`);
  };

  const handleStatusChange = (status: ApplicationStatus) => {
    setApplicantStatus(status);
    updateApplicantDetail(applicantMemo, status);
  };

  const handleMemoBlur = () => {
    updateApplicantDetail(applicantMemo, applicantStatus);
  };

  const getAnswerByQuestionId = (qId: number) =>
    applicant?.answers
      .filter((ans) => ans.id === qId)
      .map((ans) => ans.value) ?? [];

  if (!applicationFormId) return <div>지원서 정보를 불러올 수 없습니다.</div>;
  if (isLoading || isApplicantsLoading) return <Spinner />;
  if (isApplicantsError)
    return <div>지원자 데이터를 불러오는 중 오류가 발생했습니다.</div>;
  if (!applicantsData) return <div>지원자 데이터를 불러올 수 없습니다.</div>;
  if (isError) return <div>지원서 정보를 불러오는 중 오류가 발생했습니다.</div>;
  if (!formData) return <div>지원서 정보가 없습니다.</div>;
  if (!applicant) return <div>해당 지원자를 찾을 수 없습니다.</div>;

  const applicantNavItems = applicantsData.applicants.map((a) => ({
    id: a.id,
    name: a.answers[0]?.value ?? '-',
  }));

  return (
    <Styled.Container>
      <WebviewTopBar
        title='지원서 상세'
        onBack={() => navigate(`/admin/applicants-list/${applicationFormId}`)}
      />
      <Styled.Content>
        <Styled.TopSection>
          <ApplicantNavHeader
            applicants={applicantNavItems}
            currentIndex={applicantIndex}
            onPrev={handlePrev}
            onNext={handleNext}
            onSelect={handleSelectApplicant}
          />

          <Styled.StatusTabRow>
            {AVAILABLE_STATUSES.map((status) => {
              const { label } = mapStatusToGroup(status);
              return (
                <Styled.StatusTab
                  key={status}
                  $isSelected={applicantStatus === status}
                  onClick={() => handleStatusChange(status)}
                >
                  {label}
                </Styled.StatusTab>
              );
            })}
          </Styled.StatusTabRow>

          <Styled.MemoContainer>
            <Styled.MemoLabel>메모</Styled.MemoLabel>
            <Styled.MemoInput
              value={applicantMemo}
              onChange={(e) => setApplicantMemo(e.target.value)}
              onBlur={handleMemoBlur}
              placeholder='메모할 내용을 입력해주세요'
            />
          </Styled.MemoContainer>
        </Styled.TopSection>

        <Styled.Divider />

        <Styled.AnswerList>
          {formData.questions?.map((q: Question, i: number) => (
            <AnswerCard
              key={q.id}
              index={i + 1}
              question={q}
              answers={getAnswerByQuestionId(q.id)}
            />
          ))}
        </Styled.AnswerList>
      </Styled.Content>
    </Styled.Container>
  );
};

export default ApplicantDetailPageMobile;

import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAdminClubContext } from '@/context/AdminClubContext';
import Spinner from '@/components/common/Spinner/Spinner';
import debounce from '@/utils/debounce';
import { useGetApplication } from '@/hooks/queries/application/useGetApplication';
import { ApplicationStatus } from '@/types/applicants';
import mapStatusToGroup from '@/utils/mapStatusToGroup';
import { useUpdateApplicant } from '@/hooks/queries/applicants/useUpdateApplicant';
import useIsMobileView from '@/hooks/useIsMobileView';
import DesktopApplicantDetailPage from './DesktopApplicantDetailPage';
import MobileApplicantDetailPage from './MobileApplicantDetailPage';

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

const ApplicantDetailPage = () => {
  const { questionId } = useParams<{ questionId: string }>();
  const navigate = useNavigate();
  const [applicantMemo, setAppMemo] = useState('');
  const [applicantStatus, setApplicantStatus] = useState<ApplicationStatus>(
    ApplicationStatus.SUBMITTED,
  );
  const { applicantsData, clubId, applicationFormId } = useAdminClubContext();
  const isMobile = useIsMobileView();

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
      setAppMemo(applicant.memo);
      setApplicantStatus(mapStatusToGroup(applicant.status).status);
    }
  }, [applicant]);

  const updateApplicantDetail = useMemo(
    () =>
      debounce((memo, status) => {
        function isApplicationStatus(v: unknown): v is ApplicationStatus {
          return (
            typeof v === 'string' &&
            Object.values(ApplicationStatus).includes(v as ApplicationStatus)
          );
        }

        if (typeof memo !== 'string') return;
        if (!isApplicationStatus(status)) return;

        updateApplicant([
          {
            memo,
            status,
            applicantId: questionId,
          },
        ]);
      }, 400),
    [clubId, questionId, updateApplicant],
  );

  if (!applicationFormId) {
    return <div>지원서 정보를 불러올 수 없습니다.</div>;
  }

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

  const handleMemoChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newMemo = e.target.value;
    setAppMemo(newMemo);
    updateApplicantDetail(newMemo, applicantStatus);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as ApplicationStatus;
    setApplicantStatus(newStatus);
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

  const props = {
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
  };

  return isMobile ? (
    <MobileApplicantDetailPage {...props} />
  ) : (
    <DesktopApplicantDetailPage {...props} />
  );
};

export default ApplicantDetailPage;

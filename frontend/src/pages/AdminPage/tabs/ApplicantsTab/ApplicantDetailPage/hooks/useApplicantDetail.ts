import { useEffect, useState } from 'react';
import {
  useGetApplicants,
  useUpdateApplicant,
} from '@/hooks/Queries/useApplicants';
import { useGetApplication } from '@/hooks/Queries/useApplication';
import { useAdminClubId } from '@/store/useAdminClubStore';
import { ApplicationStatus } from '@/types/applicants';
import { asApplicantId } from '@/types/branded';
import mapStatusToGroup from '@/utils/mapStatusToGroup';

export const useApplicantDetail = (
  applicationFormId: string | undefined,
  questionId: string | undefined,
) => {
  const [applicantMemo, setApplicantMemo] = useState('');
  const [applicantStatus, setApplicantStatus] = useState<ApplicationStatus>(
    ApplicationStatus.SUBMITTED,
  );

  const { clubId } = useAdminClubId();

  const {
    data: applicantsData,
    isLoading: isApplicantsLoading,
    isError: isApplicantsError,
  } = useGetApplicants(applicationFormId);

  const applicantIndex =
    applicantsData?.applicants.findIndex((a) => a.id === questionId) ?? -1;
  const applicant = applicantsData?.applicants[applicantIndex];

  const {
    data: formData,
    isLoading,
    isError,
  } = useGetApplication(clubId!, applicationFormId);

  const { mutate: updateApplicant } = useUpdateApplicant(applicationFormId);

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

  const getAnswerByQuestionId = (qId: number) =>
    applicant?.answers
      .filter((ans) => ans.id === qId)
      .map((ans) => ans.value) ?? [];

  return {
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
  };
};

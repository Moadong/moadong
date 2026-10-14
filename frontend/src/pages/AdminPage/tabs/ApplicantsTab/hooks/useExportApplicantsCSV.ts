import { useGetApplication } from '@/hooks/Queries/useApplication';
import { useGetClubDetail } from '@/hooks/Queries/useClub';
import { useAdminClubId } from '@/store/useAdminClubStore';
import { Applicant } from '@/types/applicants';
import { exportApplicantsToCSV } from '@/utils/exportApplicantsToCSV';

const useExportApplicantsCSV = (
  formId: string | undefined,
  filteredApplicants: Applicant[],
  checkedIds: Set<string>,
) => {
  const { clubId } = useAdminClubId();
  const { data: clubDetail } = useGetClubDetail(clubId || '');
  const { data: applicationData } = useGetApplication(
    clubId ?? undefined,
    formId,
  );

  const handleExportCSV = () => {
    const questions = applicationData?.questions ?? [];
    const toExport =
      checkedIds.size > 0
        ? filteredApplicants.filter((a) => checkedIds.has(a.id))
        : filteredApplicants;
    const clubName = clubDetail?.name ?? '동아리';
    const formTitle = applicationData?.title ?? '지원서';
    exportApplicantsToCSV(toExport, questions, `${clubName}_${formTitle}`);
  };

  return handleExportCSV;
};

export default useExportApplicantsCSV;

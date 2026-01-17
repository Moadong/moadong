import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteApplicants, getClubApplicants } from '@/apis/applicants';
import { updateApplicantDetail } from '@/apis/application';
import { queryKeys } from '@/constants/queryKeys';
import { UpdateApplicantParams } from '@/types/applicants';

export const useGetApplicants = (applicationFormId: string | undefined) => {
  return useQuery({
    queryKey: applicationFormId
      ? queryKeys.applicants.detail(applicationFormId)
      : queryKeys.applicants.all,
    queryFn: () => getClubApplicants(applicationFormId!),
    retry: false,
    enabled: !!applicationFormId,
  });
};

export const useDeleteApplicants = (applicationFormId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ applicantIds }: { applicantIds: string[] }) =>
      deleteApplicants(applicantIds, applicationFormId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.applicants.detail(applicationFormId),
      });
    },
    onError: (error) => {
      console.error(`Error delete applicants detail: ${error}`);
    },
  });
};

export const useUpdateApplicant = (applicationFormId: string | undefined) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (applicant: UpdateApplicantParams[]) => {
      if (!applicationFormId) {
        throw new Error('Application Form ID가 유효하지 않습니다.');
      }
      return updateApplicantDetail(applicant, applicationFormId);
    },
    onSuccess: () => {
      if (applicationFormId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.applicants.detail(applicationFormId),
        });
      }
    },
    onError: (error) => {
      console.log(`Error updating applicant detail: ${error}`);
    },
  });
};

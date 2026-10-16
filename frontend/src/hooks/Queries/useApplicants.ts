import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteApplicants, getClubApplicants } from '@/apis/applicants';
import { updateApplicantDetail } from '@/apis/application';
import { queryKeys } from '@/constants/queryKeys';
import { ApplicantsInfo, UpdateApplicantParams } from '@/types/applicants';

export const useGetApplicants = (applicationFormId: string | undefined) => {
  return useQuery({
    queryKey: applicationFormId
      ? queryKeys.applicants.detail(applicationFormId)
      : queryKeys.applicants.all,
    queryFn: () => getClubApplicants(applicationFormId!),
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
  const queryKey = applicationFormId
    ? queryKeys.applicants.detail(applicationFormId)
    : null;

  return useMutation({
    mutationFn: (applicant: UpdateApplicantParams[]) => {
      if (!applicationFormId) {
        throw new Error('Application Form ID가 유효하지 않습니다.');
      }
      return updateApplicantDetail(applicant, applicationFormId);
    },
    onMutate: async (updates) => {
      if (!queryKey) return;
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<ApplicantsInfo>(queryKey);
      queryClient.setQueryData<ApplicantsInfo>(queryKey, (old) => {
        if (!old) return old;
        const updateMap = new Map(updates.map((u) => [u.applicantId, u]));
        return {
          ...old,
          applicants: old.applicants.map((a) => {
            const u = updateMap.get(a.id);
            return u ? { ...a, status: u.status, memo: u.memo } : a;
          }),
        };
      });
      return { previous };
    },
    onError: (error, _updates, context) => {
      if (queryKey && context?.previous) {
        queryClient.setQueryData(queryKey, context.previous);
      }
      console.error(`Error updating applicant detail: ${error}`);
    },
    onSettled: () => {
      if (queryKey) {
        queryClient.invalidateQueries({ queryKey });
      }
    },
  });
};

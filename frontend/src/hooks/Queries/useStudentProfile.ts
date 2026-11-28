import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  deleteProfileImage,
  getStudentProfile,
  updateStudentProfile,
  uploadProfileImage,
} from '@/apis/studentProfile';
import { queryKeys } from '@/constants/queryKeys';

export const useStudentProfile = () =>
  useQuery({
    queryKey: queryKeys.studentProfile.profile(),
    queryFn: getStudentProfile,
    staleTime: 60 * 1000,
  });

export const useUpdateStudentProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateStudentProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.studentProfile.profile(),
      });
    },
  });
};

export const useUploadProfileImage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: uploadProfileImage,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.studentProfile.profile(),
      });
    },
  });
};

export const useDeleteProfileImage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProfileImage,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.studentProfile.profile(),
      });
    },
  });
};

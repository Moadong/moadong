import { useMutation, useQuery } from '@tanstack/react-query';
import { getStudentProfile, updateStudentProfile } from '@/apis/studentProfile';
import { queryKeys } from '@/constants/queryKeys';

export const useStudentProfile = () =>
  useQuery({
    queryKey: queryKeys.studentProfile.profile(),
    queryFn: getStudentProfile,
    staleTime: 60 * 1000,
  });

export const useUpdateStudentProfile = () =>
  useMutation({
    mutationFn: updateStudentProfile,
  });

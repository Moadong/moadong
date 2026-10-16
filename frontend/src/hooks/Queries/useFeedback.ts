import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createFeedback,
  getReceivedLetter,
  getReceivedLetters,
  getSentFeedback,
  getSentFeedbacks,
  markReceivedLetterAsRead,
  uploadFeedbackImages,
} from '@/apis/feedback';
import { queryKeys } from '@/constants/queryKeys';
import { CreateFeedbackRequest, LetterCategory } from '@/types/feedback';

/**
 * 사진 업로드까지 한 뮤테이션 안에서 처리한다.
 * 서버가 저장 직전에 R2에 파일이 있는지 확인하므로 업로드가 끝난 뒤에 저장해야 한다.
 */
export const useCreateFeedback = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      files,
      ...payload
    }: CreateFeedbackRequest & { files: File[] }) => {
      const images = files.length
        ? await uploadFeedbackImages(files)
        : undefined;

      return createFeedback({ ...payload, images });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.feedback.sent() });
    },
  });
};

export const useReceivedLetters = (category?: LetterCategory) =>
  useQuery({
    queryKey: queryKeys.feedback.received(category),
    queryFn: () => getReceivedLetters(category),
    staleTime: 60 * 1000,
  });

export const useReceivedLetter = (letterId: string) =>
  useQuery({
    queryKey: queryKeys.feedback.receivedDetail(letterId),
    queryFn: () => getReceivedLetter(letterId),
    staleTime: 60 * 1000,
  });

/** 상세를 열면 읽음 처리한다. 목록의 안 읽음 배경과 필터 점이 갱신되어야 하므로 목록을 무효화한다 */
export const useMarkLetterAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (letterId: string) => markReceivedLetterAsRead(letterId),
    onSuccess: () => {
      // 상세까지 무효화하면 재조회 → 이펙트 재실행으로 순환한다. 목록만 건드린다.
      queryClient.invalidateQueries({
        queryKey: queryKeys.feedback.receivedAll,
      });
    },
  });
};

export const useSentFeedbacks = () =>
  useQuery({
    queryKey: queryKeys.feedback.sent(),
    queryFn: getSentFeedbacks,
    staleTime: 60 * 1000,
  });

export const useSentFeedback = (feedbackId: string) =>
  useQuery({
    queryKey: queryKeys.feedback.sentDetail(feedbackId),
    queryFn: () => getSentFeedback(feedbackId),
    staleTime: 60 * 1000,
  });

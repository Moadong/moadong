import { useLocation } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createPromotionArticle,
  deletePromotionArticle,
  getPromotionArticles,
  updatePromotionArticle,
  uploadPromotionImage,
} from '@/apis/promotion';
import { queryKeys } from '@/constants/queryKeys';
import {
  CreatePromotionArticleRequest,
  PromotionArticle,
  UpdatePromotionArticleRequest,
} from '@/types/promotion';

export const useGetPromotionArticles = () => {
  const location = useLocation();
  const isPromotionPage = location.pathname.startsWith('/promotions');

  return useQuery<PromotionArticle[]>({
    queryKey: queryKeys.promotion.list(),
    queryFn: getPromotionArticles,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: true,
    refetchInterval: isPromotionPage ? 180000 : 300000,
    refetchIntervalInBackground: false,
  });
};

export const useCreatePromotionArticle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreatePromotionArticleRequest) =>
      createPromotionArticle(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.promotion.list(),
      });
    },
    onError: (error) => {
      console.error('Error creating promotion article:', error);
    },
  });
};

export const useUpdatePromotionArticle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      articleId,
      payload,
    }: {
      articleId: string;
      payload: UpdatePromotionArticleRequest;
    }) => updatePromotionArticle(articleId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.promotion.list(),
      });
    },
    onError: (error) => {
      console.error('Error updating promotion article:', error);
    },
  });
};

export const useDeletePromotionArticle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (articleId: string) => deletePromotionArticle(articleId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.promotion.list(),
      });
    },
    onError: (error) => {
      console.error('Error deleting promotion article:', error);
    },
  });
};

/** 서버가 업로드된 URL을 글의 images에 바로 추가하므로 목록도 함께 무효화한다 */
export const useUploadPromotionImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ articleId, file }: { articleId: string; file: File }) =>
      uploadPromotionImage(articleId, file),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.promotion.list(),
      });
    },
    onError: (error) => {
      console.error('Error uploading promotion image:', error);
    },
  });
};

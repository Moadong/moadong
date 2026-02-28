import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createPromotionArticle, getPromotionArticles } from '@/apis/promotion';
import { queryKeys } from '@/constants/queryKeys';
import {
  CreatePromotionArticleRequest,
  PromotionArticle,
} from '@/types/promotion';

export const useGetPromotionArticles = () => {
  return useQuery<PromotionArticle[]>({
    queryKey: queryKeys.promotion.list(),
    queryFn: getPromotionArticles,
    staleTime: 60 * 1000,
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

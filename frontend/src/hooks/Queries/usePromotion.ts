import { useLocation } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createPromotionArticle, getPromotionArticles } from '@/apis/promotion';
import { queryKeys } from '@/constants/queryKeys';
import {
  CreatePromotionArticleRequest,
  PromotionArticle,
} from '@/types/promotion';

export const useGetPromotionArticles = () => {
  const location = useLocation();
  const isPromotionPage = location.pathname.startsWith('/promotions');

  return useQuery<PromotionArticle[]>({
    queryKey: queryKeys.promotion.list(),
    queryFn: getPromotionArticles,
    staleTime: 1000 * 60 * 5,
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

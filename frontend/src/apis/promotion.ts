import API_BASE_URL from '@/constants/api';
import {
  CreatePromotionArticleRequest,
  PromotionArticle,
} from '@/types/promotion';
import { secureFetch } from './auth/secureFetch';
import { handleResponse } from './utils/apiHelpers';

export const getPromotionArticles = async (): Promise<PromotionArticle[]> => {
  const response = await fetch(`${API_BASE_URL}/api/promotion`);
  const data = await handleResponse<{ articles: PromotionArticle[] }>(
    response,
    '홍보게시판 목록을 불러오는데 실패했습니다.',
  );

  if (!data?.articles) {
    return [];
  }

  return data.articles;
};

export const createPromotionArticle = async (
  payload: CreatePromotionArticleRequest,
) => {
  const response = await secureFetch(`${API_BASE_URL}/api/promotion`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  return handleResponse(response, '홍보게시판 글 추가에 실패했습니다.');
};

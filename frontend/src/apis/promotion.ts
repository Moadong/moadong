import API_BASE_URL from '@/constants/api';
import { festivalMock } from '@/mocks/data/festivalMock';
import { sortPromotions } from '@/pages/PromotionPage/utils/sortPromotions';
import {
  CreatePromotionArticleRequest,
  CreatePromotionArticleResponse,
  PromotionArticle,
  PromotionImageUploadResponse,
  UpdatePromotionArticleRequest,
} from '@/types/promotion';
import { secureFetch } from './auth/secureFetch';
import { handleResponse } from './utils/apiHelpers';
import { fetchWithTimeout } from './utils/fetchWithTimeout';

export const getPromotionArticles = async (): Promise<PromotionArticle[]> => {
  const response = await fetchWithTimeout(`${API_BASE_URL}/api/promotion`);
  const data = await handleResponse<{ articles: PromotionArticle[] }>(
    response,
    '홍보게시판 목록을 불러오는데 실패했습니다.',
  );

  const serverArticle = data?.articles ?? [];

  const isTest =
    typeof process !== 'undefined' && process.env.NODE_ENV === 'test';

  if (isTest) {
    return serverArticle;
  }

  const merged = [...festivalMock, ...serverArticle];

  return sortPromotions(merged);
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

  return handleResponse<CreatePromotionArticleResponse>(
    response,
    '홍보게시판 글 추가에 실패했습니다.',
  );
};

export const updatePromotionArticle = async (
  articleId: string,
  payload: UpdatePromotionArticleRequest,
) => {
  const response = await secureFetch(
    `${API_BASE_URL}/api/promotion/${articleId}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    },
  );

  await handleResponse(response, '홍보게시판 글 수정에 실패했습니다.');
};

export const deletePromotionArticle = async (articleId: string) => {
  const response = await secureFetch(
    `${API_BASE_URL}/api/promotion/${articleId}`,
    { method: 'DELETE' },
  );

  await handleResponse(response, '홍보게시판 글 삭제에 실패했습니다.');
};

/**
 * 이미지는 글을 먼저 만들어 articleId를 받은 뒤 올린다.
 * 서버가 업로드된 URL을 해당 글의 images에 바로 추가하므로 생성 직후에는 PUT이 필요 없다.
 */
export const uploadPromotionImage = async (articleId: string, file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await secureFetch(
    `${API_BASE_URL}/api/promotion/${articleId}/upload`,
    {
      method: 'POST',
      body: formData,
    },
  );

  return handleResponse<PromotionImageUploadResponse>(
    response,
    '홍보 이미지 업로드에 실패했습니다.',
  );
};

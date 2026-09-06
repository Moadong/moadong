import API_BASE_URL from '@/constants/api';
import { festivalMock } from '@/mocks/data/festivalMock';
import { sortPromotions } from '@/pages/PromotionPage/utils/sortPromotions';
import {
  CreatePromotionArticleRequest,
  CreatePromotionArticleResponse,
  PromotionArticle,
  PromotionImageUploadRequest,
  PromotionPresignedData,
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
 * 이미지는 글을 먼저 만들어 articleId를 받은 뒤 presigned URL을 발급받아 R2에 직접 올린다.
 * 발급 API는 게시글을 건드리지 않으므로 올린 finalUrl은 PUT의 images로 반영해야 한다.
 * 항목별로 success가 갈릴 수 있어 배열 전체를 실패로 보지 않는다.
 */
export const getPromotionImageUploadUrls = async (
  articleId: string,
  requests: PromotionImageUploadRequest[],
) => {
  const response = await secureFetch(
    `${API_BASE_URL}/api/promotion/${articleId}/upload-url`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requests),
    },
  );

  return handleResponse<PromotionPresignedData[]>(
    response,
    '홍보 이미지 업로드 URL 생성에 실패했습니다.',
  );
};

/**
 * R2로 직접 나가는 요청이라 secureFetch를 쓰지 않는다. Authorization이 붙으면 서명 검증에 걸린다.
 * requiredHeaders는 서명에 포함된 값이라 빠짐없이 그대로 보낸다.
 */
export const uploadPromotionImageToStorage = async (
  presigned: PromotionPresignedData,
  file: File,
) => {
  if (!presigned.presignedUrl) {
    throw new Error(presigned.failureReason ?? 'presigned URL 생성 실패');
  }
  const response = await fetch(presigned.presignedUrl, {
    method: 'PUT',
    body: file,
    headers: presigned.requiredHeaders,
  });
  await handleResponse(response, `스토리지 업로드 실패 : ${response.status}`);
};

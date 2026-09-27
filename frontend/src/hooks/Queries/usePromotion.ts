import { useLocation } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createPromotionArticle,
  deletePromotionArticle,
  getPromotionArticles,
  getPromotionImageUploadUrls,
  updatePromotionArticle,
  uploadPromotionImageToStorage,
} from '@/apis/promotion';
import { queryKeys } from '@/constants/queryKeys';
import { ALLOWED_IMAGE_TYPES } from '@/constants/uploadLimit';
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

interface PromotionImageUploadParams {
  articleId: string;
  files: File[];
}

export interface PromotionImageUploadResult {
  /** 올라간 파일과 최종 URL. 요청 순서를 유지한다 */
  uploaded: { file: File; url: string }[];
  failedFiles: File[];
}

/**
 * presigned URL 발급 → R2 병렬 PUT → 성공한 finalUrl 수집 (useUploadFeed와 같은 흐름).
 * 발급 API는 게시글을 건드리지 않으므로 목록 무효화는 PUT 쪽(useUpdatePromotionArticle)에서 한다.
 */
export const useUploadPromotionImages = () =>
  useMutation({
    mutationFn: async ({
      articleId,
      files,
    }: PromotionImageUploadParams): Promise<PromotionImageUploadResult> => {
      if (files.length === 0) return { uploaded: [], failedFiles: [] };

      const requests = files.map((file) => ({
        fileName: file.name,
        contentType: (ALLOWED_IMAGE_TYPES as readonly string[]).includes(
          file.type,
        )
          ? file.type
          : 'image/jpeg',
      }));
      const presignedList = await getPromotionImageUploadUrls(
        articleId,
        requests,
      );
      if (!presignedList) {
        throw new Error('홍보 이미지 업로드 URL 생성 실패');
      }

      // 발급 자체가 실패한 항목(success=false)은 PUT을 건너뛰고 실패로 센다
      const results = await Promise.allSettled(
        files.map((file, i) =>
          uploadPromotionImageToStorage(presignedList[i], file),
        ),
      );

      const uploaded: PromotionImageUploadResult['uploaded'] = [];
      const failedFiles: File[] = [];
      results.forEach((result, i) => {
        if (result.status === 'fulfilled' && presignedList[i].finalUrl) {
          uploaded.push({ file: files[i], url: presignedList[i].finalUrl });
        } else {
          failedFiles.push(files[i]);
        }
      });
      return { uploaded, failedFiles };
    },
    onError: (error) => {
      console.error('Error uploading promotion images:', error);
    },
  });

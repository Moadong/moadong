import { useEffect, useRef, useState } from 'react';
import { getServerErrorMessage } from '@/apis/utils/getServerErrorMessage';
import {
  useCreatePromotionArticle,
  useUpdatePromotionArticle,
  useUploadPromotionImages,
} from '@/hooks/Queries/usePromotion';
import { buildFinalUrls } from '@/pages/AdminPage/components/ImageSortGrid/buildFinalUrls';
import {
  ImageItem,
  LocalItem,
} from '@/pages/AdminPage/components/ImageSortGrid/types';
import { PromotionArticle } from '@/types/promotion';
import {
  articleToFormValues,
  buildPromotionPayload,
  createEmptyPromotionForm,
  PromotionFormValues,
  validatePromotionForm,
} from '../utils/promotionForm';

export type SaveResult =
  | { status: 'success'; articleId: string }
  /** 글은 저장됐지만 일부 이미지 업로드가 실패해 수정 화면에서 다시 올려야 하는 경우 */
  | { status: 'partial'; articleId: string; failedCount: number }
  | { status: 'error'; message: string };

interface UsePromotionFormParams {
  clubId: string;
  /** 수정 모드면 대상 글, 작성 모드면 undefined */
  article?: PromotionArticle;
}

/**
 * 작성·수정이 같은 폼을 쓴다. 이미지는 글이 있어야 올릴 수 있어서
 * (작성이면 먼저 생성) → presigned 업로드 → PUT(기존 유지분 + 새 URL) 순으로 간다.
 * PUT이 이미지 저장의 유일한 경로다.
 */
export const usePromotionForm = ({
  clubId,
  article,
}: UsePromotionFormParams) => {
  const mode = article ? 'edit' : 'create';
  const [values, setValues] = useState<PromotionFormValues>(
    createEmptyPromotionForm,
  );
  const [isSaving, setIsSaving] = useState(false);

  const { mutateAsync: createArticle } = useCreatePromotionArticle();
  const { mutateAsync: updateArticle } = useUpdatePromotionArticle();
  const { mutateAsync: uploadImages } = useUploadPromotionImages();

  // 수정 모드에서 목록 쿼리가 늦게 도착해도 폼에 채워지도록 하되,
  // 같은 글의 재조회(업로드 후 invalidate 등)로 입력 중인 값을 덮어쓰지 않도록 id 기준으로 한 번만 채운다.
  // 렌더 중 상태 조정 패턴(react.dev "이전 렌더 값 저장")이라 effect 없이 동기화된다.
  const [loadedArticleId, setLoadedArticleId] = useState<string | null>(null);
  if (article && article.id !== loadedArticleId) {
    setLoadedArticleId(article.id);
    setValues(articleToFormValues(article));
  }

  // 미리보기 URL은 화면을 떠날 때 모두 해제한다 (PhotoEditTab의 feedItemsRef와 같은 방식)
  const valuesRef = useRef(values);
  useEffect(() => {
    valuesRef.current = values;
  }, [values]);
  useEffect(
    () => () =>
      valuesRef.current.images.forEach((item) => {
        if (item.type === 'local') URL.revokeObjectURL(item.previewUrl);
      }),
    [],
  );

  const setField = <K extends keyof PromotionFormValues>(
    key: K,
    value: PromotionFormValues[K],
  ) => setValues((prev) => ({ ...prev, [key]: value }));

  const addFiles = (files: File[]) =>
    setValues((prev) => ({
      ...prev,
      images: [
        ...prev.images,
        ...files.map(
          (file): LocalItem => ({
            type: 'local',
            file,
            previewUrl: URL.createObjectURL(file),
            status: 'pending',
          }),
        ),
      ],
    }));

  const removeImage = (index: number) =>
    setValues((prev) => {
      const target = prev.images[index];
      if (target?.type === 'local') URL.revokeObjectURL(target.previewUrl);
      return { ...prev, images: prev.images.filter((_, i) => i !== index) };
    });

  const reorderImages = (images: ImageItem[]) =>
    setValues((prev) => ({ ...prev, images }));

  /** 아직 안 올린 파일만 업로드하고, 화면 순서를 유지한 채 URL 목록을 만든다 */
  const uploadFiles = async (articleId: string) => {
    const localFiles = values.images
      .filter((item): item is LocalItem => item.type === 'local')
      .map(({ file }) => file);

    const { uploaded, failedFiles } =
      localFiles.length > 0
        ? await uploadImages({ articleId, files: localFiles })
        : { uploaded: [], failedFiles: [] };
    const urlByFile = new Map(uploaded.map(({ file, url }) => [file, url]));

    // 올라간 파일만 제자리에서 uploaded로 바꾼다. 일부 실패로 화면에 남았을 때 다시 저장해도 중복 업로드되지 않는다.
    // 실패한 파일은 failed로 표시해 어느 장이 안 올라갔는지 화면에서 알 수 있게 한다.
    // previewUrl은 계속 보여줘야 하므로 revoke하지 않는다.
    setValues((prev) => ({
      ...prev,
      images: prev.images.map((item) => {
        if (item.type !== 'local') return item;
        const url = urlByFile.get(item.file);
        if (!url) return { ...item, status: 'failed' };
        URL.revokeObjectURL(item.previewUrl);
        return { type: 'uploaded', url };
      }),
    }));

    return {
      orderedUrls: buildFinalUrls(values.images, urlByFile),
      failedCount: failedFiles.length,
    };
  };

  const save = async (): Promise<SaveResult> => {
    const validationError = validatePromotionForm(values, mode);
    if (validationError) return { status: 'error', message: validationError };

    setIsSaving(true);
    try {
      let articleId = article?.id;
      if (!articleId) {
        const created = await createArticle(
          buildPromotionPayload(values, clubId, []),
        );
        if (!created?.articleId) {
          return {
            status: 'error',
            message: '홍보 게시글 저장에 실패했습니다.',
          };
        }
        articleId = created.articleId;
      }

      const { orderedUrls: images, failedCount } = await uploadFiles(articleId);

      // PUT은 images를 1개 이상 요구한다. 작성에서 올릴 이미지가 없으면 PUT할 것도 없고,
      // 수정에서 여기 오는 건 검증을 통과한 이미지가 전부 업로드 실패한 경우뿐이다.
      if (images.length === 0) {
        if (mode === 'edit') {
          return {
            status: 'error',
            message: '이미지 업로드에 실패했습니다. 다시 시도해주세요.',
          };
        }
        return failedCount > 0
          ? { status: 'partial', articleId, failedCount }
          : { status: 'success', articleId };
      }

      await updateArticle({
        articleId,
        payload: buildPromotionPayload(values, clubId, images),
      });
      return failedCount > 0
        ? { status: 'partial', articleId, failedCount }
        : { status: 'success', articleId };
    } catch (error) {
      return {
        status: 'error',
        message: getServerErrorMessage(
          error,
          '홍보 게시글 저장에 실패했습니다.',
        ),
      };
    } finally {
      setIsSaving(false);
    }
  };

  return {
    mode,
    values,
    setField,
    addFiles,
    removeImage,
    reorderImages,
    isSaving,
    save,
  };
};

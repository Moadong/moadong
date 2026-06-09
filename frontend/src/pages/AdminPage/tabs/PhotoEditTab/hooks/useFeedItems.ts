import { useEffect, useRef, useState } from 'react';
import { useUpdateFeed, useUploadFeed } from '@/hooks/Queries/useClubImages';
import {
  extractLocalItems,
  extractUploadedUrls,
  findOversizedFile,
  hasPendingChanges,
  sliceToLimit,
} from '../photoEditUtils';
import { FeedItem, LocalItem, UploadedItem } from '../types';

export const useFeedItems = (clubId: string, originalFeeds: string[]) => {
  const { mutate: uploadFeed, isPending: isUploading } = useUploadFeed();
  const { mutate: updateFeed, isPending: isUpdating } = useUpdateFeed();

  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const feedItemsRef = useRef<FeedItem[]>(feedItems);

  const isLoading = isUploading || isUpdating;
  const pendingChanges = hasPendingChanges(feedItems, originalFeeds);

  useEffect(() => {
    feedItemsRef.current = feedItems;
  }, [feedItems]);

  // 업로드 진행 중에는 서버 재조회 결과로 UI를 덮어쓰지 않는다.
  // local 아이템이 남아있는 동안은 사용자가 보고 있는 상태를 유지한다.
  useEffect(() => {
    if (feedItemsRef.current.some((item) => item.type === 'local')) return;
    setFeedItems(
      (originalFeeds || []).map((url) => ({ type: 'uploaded', url })),
    );
  }, [originalFeeds]);

  useEffect(() => {
    return () => {
      feedItemsRef.current.forEach((item) => {
        if (item.type === 'local') URL.revokeObjectURL(item.previewUrl);
      });
    };
  }, []);

  const addFiles = (fileList: File[]) => {
    const selected = sliceToLimit(fileList, feedItems.length);
    const oversized = findOversizedFile(selected);
    if (oversized) {
      alert(`${oversized.name}의 용량이 제한을 초과했습니다.`);
      return;
    }
    const newItems: LocalItem[] = selected.map((file) => ({
      type: 'local',
      file,
      previewUrl: URL.createObjectURL(file),
      status: 'pending',
    }));
    setFeedItems((prev) => [...prev, ...newItems]);
  };

  const deleteImage = (index: number) => {
    if (isLoading) return;
    const item = feedItems[index];
    if (item.type === 'local') URL.revokeObjectURL(item.previewUrl);
    setFeedItems((prev) => prev.filter((_, i) => i !== index));
  };

  const clearAll = () => {
    feedItems.forEach((item) => {
      if (item.type === 'local') URL.revokeObjectURL(item.previewUrl);
    });
    setFeedItems([]);
  };

  const retryItem = (index: number) => {
    const item = feedItems[index];
    if (item.type !== 'local' || item.status !== 'failed') return;

    const targetFile = item.file;
    const uploadedUrls = extractUploadedUrls(feedItems);

    setFeedItems((prev) =>
      prev.map((it, i) =>
        i === index && it.type === 'local'
          ? { ...it, status: 'uploading' }
          : it,
      ),
    );

    uploadFeed(
      { clubId, files: [targetFile], existingUrls: uploadedUrls },
      {
        onSuccess: (data) => {
          const finalUrl = data.successfulUrls[0];
          if (!finalUrl) return;
          setFeedItems((prev) =>
            prev.map((it) => {
              if (it.type !== 'local' || it.file !== targetFile) return it;
              URL.revokeObjectURL(it.previewUrl);
              return { type: 'uploaded', url: finalUrl } as UploadedItem;
            }),
          );
        },
        onError: () => {
          setFeedItems((prev) =>
            prev.map((it) =>
              it.type === 'local' && it.file === targetFile
                ? { ...it, status: 'failed' }
                : it,
            ),
          );
        },
      },
    );
  };

  const save = () => {
    const localItems = extractLocalItems(feedItems);
    const uploadedUrls = extractUploadedUrls(feedItems);

    if (localItems.length === 0) {
      updateFeed(
        { clubId, urls: uploadedUrls },
        { onError: () => alert('저장에 실패했어요. 다시 시도해주세요!') },
      );
      return;
    }

    const filesToUpload = localItems.map((item) => item.file);

    setFeedItems((prev) =>
      prev.map((item) =>
        item.type === 'local' ? { ...item, status: 'uploading' } : item,
      ),
    );

    uploadFeed(
      {
        clubId,
        files: filesToUpload,
        existingUrls: uploadedUrls,
        // File 객체 참조로 매핑 — 인덱스 불일치 버그 방지
        onItemStatusChange: (file, status) => {
          setFeedItems((prev) =>
            prev.map((item) =>
              item.type === 'local' && item.file === file
                ? { ...item, status }
                : item,
            ),
          );
        },
      },
      {
        onSuccess: (data) => {
          if (data.failedFiles.length > 0) {
            alert(
              `일부 파일 업로드에 실패했어요.\n실패한 파일: ${data.failedFiles.join(', ')}\n\n성공한 파일은 정상적으로 등록되었어요.`,
            );
          }
          setFeedItems((prev) => {
            let successIdx = 0;
            return prev.map((item) => {
              if (item.type !== 'local' || item.status === 'failed')
                return item;
              const finalUrl = data.successfulUrls[successIdx++];
              URL.revokeObjectURL(item.previewUrl);
              return { type: 'uploaded', url: finalUrl } as UploadedItem;
            });
          });
        },
        onError: () => {
          alert('이미지 업로드에 실패했어요. 다시 시도해주세요!');
          // pending 포함 모든 local 아이템을 failed로 복구
          setFeedItems((prev) =>
            prev.map((item) =>
              item.type === 'local' &&
              (item.status === 'uploading' || item.status === 'pending')
                ? { ...item, status: 'failed' }
                : item,
            ),
          );
        },
      },
    );
  };

  return {
    feedItems,
    feedItemsRef,
    setFeedItems,
    isLoading,
    pendingChanges,
    addFiles,
    deleteImage,
    clearAll,
    retryItem,
    save,
  };
};

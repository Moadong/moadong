import { useEffect, useRef, useState } from 'react';
import { useUploadFeed, useUpdateFeed } from '@/hooks/Queries/useClubImages';
import { findOversizedFile, hasPendingChanges, sliceToLimit } from '../photoEditUtils';
import { FeedItem, LocalItem, UploadedItem } from '../PhotoEditTab';

export const useFeedItems = (clubId: string, originalFeeds: string[]) => {
  const { mutate: uploadFeed, isPending: isUploading } = useUploadFeed();
  const { mutate: updateFeed, isPending: isUpdating } = useUpdateFeed();

  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const feedItemsRef = useRef<FeedItem[]>(feedItems);

  const isLoading = isUploading || isUpdating;
  const pendingChanges = hasPendingChanges(feedItems, originalFeeds);

  useEffect(() => { feedItemsRef.current = feedItems; }, [feedItems]);

  useEffect(() => {
    setFeedItems((originalFeeds || []).map((url) => ({ type: 'uploaded', url })));
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

    const uploadedUrls = feedItems
      .filter((it): it is UploadedItem => it.type === 'uploaded')
      .map((it) => it.url);

    setFeedItems((prev) =>
      prev.map((it, i) =>
        i === index && it.type === 'local' ? { ...it, status: 'uploading' } : it,
      ),
    );

    uploadFeed(
      { clubId, files: [item.file], existingUrls: uploadedUrls },
      {
        onSuccess: (data) => {
          const finalUrl = data.successfulUrls[0];
          if (!finalUrl) return;
          setFeedItems((prev) =>
            prev.map((it, i) => {
              if (i !== index || it.type !== 'local') return it;
              URL.revokeObjectURL(it.previewUrl);
              return { type: 'uploaded', url: finalUrl } as UploadedItem;
            }),
          );
        },
        onError: () => {
          setFeedItems((prev) =>
            prev.map((it, i) =>
              i === index && it.type === 'local' ? { ...it, status: 'failed' } : it,
            ),
          );
        },
      },
    );
  };

  const save = () => {
    const localItems = feedItems.filter((item): item is LocalItem => item.type === 'local');
    const uploadedUrls = feedItems
      .filter((item): item is UploadedItem => item.type === 'uploaded')
      .map((item) => item.url);

    if (localItems.length === 0) {
      updateFeed(
        { clubId, urls: uploadedUrls },
        { onError: () => alert('저장에 실패했어요. 다시 시도해주세요!') },
      );
      return;
    }

    setFeedItems((prev) =>
      prev.map((item) => (item.type === 'local' ? { ...item, status: 'uploading' } : item)),
    );

    uploadFeed(
      {
        clubId,
        files: localItems.map((item) => item.file),
        existingUrls: uploadedUrls,
        onItemStatusChange: (localIdx, status) => {
          setFeedItems((prev) => {
            let count = 0;
            return prev.map((item) => {
              if (item.type !== 'local') return item;
              return count++ === localIdx ? { ...item, status } : item;
            });
          });
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
              if (item.type !== 'local' || item.status === 'failed') return item;
              const finalUrl = data.successfulUrls[successIdx++];
              URL.revokeObjectURL(item.previewUrl);
              return { type: 'uploaded', url: finalUrl } as UploadedItem;
            });
          });
        },
        onError: () => {
          alert('이미지 업로드에 실패했어요. 다시 시도해주세요!');
          setFeedItems((prev) =>
            prev.map((item) =>
              item.type === 'local' && item.status === 'uploading'
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

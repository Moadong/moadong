import { MAX_FILE_COUNT, MAX_FILE_SIZE } from '@/constants/uploadLimit';
import { FeedItem, LocalItem, UploadedItem } from './types';

export const findOversizedFile = (files: File[]): File | undefined =>
  files.find((f) => f.size > MAX_FILE_SIZE);

export const sliceToLimit = (files: File[], currentCount: number): File[] => {
  const remaining = MAX_FILE_COUNT - currentCount;
  return files.slice(0, remaining);
};

export const reorderItems = (
  items: FeedItem[],
  dragIndex: number,
  targetIndex: number,
): FeedItem[] => {
  const next = [...items];
  const [moved] = next.splice(dragIndex, 1);
  const insertAt = dragIndex < targetIndex ? targetIndex - 1 : targetIndex;
  next.splice(insertAt, 0, moved);
  return next;
};

export const hasPendingChanges = (
  feedItems: FeedItem[],
  originalFeeds: string[],
): boolean => {
  if (feedItems.some((item) => item.type === 'local')) return true;
  const currentUrls = feedItems
    .filter((item): item is UploadedItem => item.type === 'uploaded')
    .map((item) => item.url);
  return currentUrls.join() !== originalFeeds.join();
};

export const extractLocalItems = (feedItems: FeedItem[]): LocalItem[] =>
  feedItems.filter((item): item is LocalItem => item.type === 'local');

export const extractUploadedUrls = (feedItems: FeedItem[]): string[] =>
  feedItems
    .filter((item): item is UploadedItem => item.type === 'uploaded')
    .map((item) => item.url);

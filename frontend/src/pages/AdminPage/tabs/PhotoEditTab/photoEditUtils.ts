import { MAX_FILE_COUNT, MAX_FILE_SIZE } from '@/constants/uploadLimit';
import {
  ImageItem,
  LocalItem,
  UploadedItem,
} from '@/pages/AdminPage/components/ImageSortGrid/types';

export const findOversizedFile = (files: File[]): File | undefined =>
  files.find((f) => f.size > MAX_FILE_SIZE);

export const sliceToLimit = (files: File[], currentCount: number): File[] => {
  const remaining = MAX_FILE_COUNT - currentCount;
  return files.slice(0, remaining);
};

export const hasPendingChanges = (
  feedItems: ImageItem[],
  originalFeeds: string[],
): boolean => {
  if (feedItems.some((item) => item.type === 'local')) return true;
  const currentUrls = feedItems
    .filter((item): item is UploadedItem => item.type === 'uploaded')
    .map((item) => item.url);
  return currentUrls.join() !== originalFeeds.join();
};

export const extractLocalItems = (feedItems: ImageItem[]): LocalItem[] =>
  feedItems.filter((item): item is LocalItem => item.type === 'local');

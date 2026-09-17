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

// 화면 순서(feedItems)를 그대로 보존한 최종 URL 배열을 만든다.
// 업로드되지 않아 URL이 없는 local 아이템은 제외된다.
export const buildFinalUrls = (
  feedItems: FeedItem[],
  urlByFile: Map<File, string>,
): string[] =>
  feedItems.reduce<string[]>((acc, item) => {
    if (item.type === 'uploaded') {
      acc.push(item.url);
      return acc;
    }
    const url = urlByFile.get(item.file);
    if (url) acc.push(url);
    return acc;
  }, []);

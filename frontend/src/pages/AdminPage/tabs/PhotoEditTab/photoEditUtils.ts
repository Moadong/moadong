import {
  ALLOWED_IMAGE_TYPES,
  MAX_FILE_COUNT,
  MAX_FILE_SIZE,
} from '@/constants/uploadLimit';
import {
  ImageItem,
  LocalItem,
  UploadedItem,
} from '@/pages/AdminPage/components/ImageSortGrid/types';

export const findOversizedFile = (files: File[]): File | undefined =>
  files.find((f) => f.size > MAX_FILE_SIZE);

/**
 * type이 빈 파일은 presign 요청과 PUT 양쪽이 image/jpeg로 폴백해 서로 맞으므로 통과시킨다.
 * 목록 밖 type만 걸러야 두 값이 어긋나 R2가 403을 내는 경우가 사라진다.
 */
export const findUnsupportedFile = (files: File[]): File | undefined =>
  files.find(
    (f) =>
      f.type !== '' &&
      !(ALLOWED_IMAGE_TYPES as readonly string[]).includes(f.type),
  );

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

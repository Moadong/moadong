import { MAX_FILE_COUNT, MAX_FILE_SIZE } from '@/constants/uploadLimit';
import { FeedItem, LocalItem, UploadedItem } from './PhotoEditTab';

export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/bmp',
  'image/webp',
];

// 파일 목록에서 용량 초과 파일 반환
export const findOversizedFile = (files: File[]): File | undefined =>
  files.find((f) => f.size > MAX_FILE_SIZE);

// 현재 아이템 수 기준으로 추가 가능한 파일만 슬라이스
export const sliceToLimit = (files: File[], currentCount: number): File[] => {
  const remaining = MAX_FILE_COUNT - currentCount;
  return files.slice(0, remaining);
};

// 드래그 앤 드롭 순서 변경
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

// 저장 버튼 활성화 여부 — 로컬 파일이 있거나 uploaded URL 순서/삭제 변경 시 true
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

// 활동사진 탭에서 사용하는 피드 아이템 타입 정의

export interface UploadedItem {
  type: 'uploaded';
  url: string;
}

export interface LocalItem {
  type: 'local';
  file: File;
  previewUrl: string;
  status: 'pending' | 'uploading' | 'failed';
}

export type FeedItem = UploadedItem | LocalItem;

export type ItemStatus = LocalItem['status'];

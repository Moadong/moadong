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

export type ImageItem = UploadedItem | LocalItem;

export type ItemStatus = LocalItem['status'];

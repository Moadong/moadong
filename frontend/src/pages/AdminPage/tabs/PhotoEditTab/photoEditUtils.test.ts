import { MAX_FILE_COUNT, MAX_FILE_SIZE } from '@/constants/uploadLimit';
import {
  ImageItem,
  LocalItem,
} from '@/pages/AdminPage/components/ImageSortGrid/types';
import {
  findOversizedFile,
  findUnsupportedFile,
  hasPendingChanges,
  sliceToLimit,
} from './photoEditUtils';

const makeUploaded = (url: string): ImageItem => ({ type: 'uploaded', url });
const makeLocal = (name: string): LocalItem => ({
  type: 'local',
  file: new File([''], name, { type: 'image/jpeg' }),
  previewUrl: `blob:${name}`,
  status: 'pending',
});

describe('sliceToLimit', () => {
  const files = Array.from(
    { length: 10 },
    (_, i) => new File([''], `file${i}.jpg`, { type: 'image/jpeg' }),
  );

  it('현재 개수 + 파일 수가 MAX_FILE_COUNT 이하이면 전부 반환한다', () => {
    const result = sliceToLimit(files.slice(0, 3), 10);
    expect(result).toHaveLength(3);
  });

  it('현재 개수 + 파일 수가 MAX_FILE_COUNT 초과이면 남은 슬롯만큼만 반환한다', () => {
    const result = sliceToLimit(files, MAX_FILE_COUNT - 2);
    expect(result).toHaveLength(2);
  });

  it('이미 MAX_FILE_COUNT에 도달했으면 빈 배열을 반환한다', () => {
    const result = sliceToLimit(files, MAX_FILE_COUNT);
    expect(result).toHaveLength(0);
  });
});

describe('findOversizedFile', () => {
  it('모든 파일이 MAX_FILE_SIZE 이하이면 undefined를 반환한다', () => {
    const files = [
      new File(['a'.repeat(1024)], 'small.jpg', { type: 'image/jpeg' }),
    ];
    expect(findOversizedFile(files)).toBeUndefined();
  });

  it('MAX_FILE_SIZE 초과 파일이 있으면 해당 파일을 반환한다', () => {
    const oversized = new File(
      [new ArrayBuffer(MAX_FILE_SIZE + 1)],
      'big.jpg',
      { type: 'image/jpeg' },
    );
    const normal = new File(['a'], 'small.jpg', { type: 'image/jpeg' });
    expect(findOversizedFile([normal, oversized])).toBe(oversized);
  });

  it('빈 배열이면 undefined를 반환한다', () => {
    expect(findOversizedFile([])).toBeUndefined();
  });
});

describe('findUnsupportedFile', () => {
  it('허용된 이미지 형식만 고르면 걸리는 파일이 없다', () => {
    const files = [
      new File(['a'], 'a.jpg', { type: 'image/jpeg' }),
      new File(['a'], 'b.png', { type: 'image/png' }),
    ];
    expect(findUnsupportedFile(files)).toBeUndefined();
  });

  it('지원하지 않는 형식이 섞여 있으면 그 파일을 집어낸다', () => {
    const unsupported = new File(['a'], 'a.jpg', {
      type: 'application/octet-stream',
    });
    const normal = new File(['a'], 'b.jpg', { type: 'image/jpeg' });
    expect(findUnsupportedFile([normal, unsupported])).toBe(unsupported);
  });

  // type이 비면 presign과 PUT 양쪽이 image/jpeg로 폴백해 서로 맞으므로 막지 않는다.
  it('형식을 알 수 없는 파일은 막지 않는다', () => {
    const files = [new File(['a'], 'a.jpg', { type: '' })];
    expect(findUnsupportedFile(files)).toBeUndefined();
  });

  it('고른 파일이 없으면 걸리는 파일도 없다', () => {
    expect(findUnsupportedFile([])).toBeUndefined();
  });
});

describe('hasPendingChanges', () => {
  it('local 아이템이 있으면 true를 반환한다', () => {
    const feedItems: ImageItem[] = [makeUploaded('a'), makeLocal('new.jpg')];
    expect(hasPendingChanges(feedItems, ['a'])).toBe(true);
  });

  it('uploaded URL이 원본과 동일하면 false를 반환한다', () => {
    const feedItems: ImageItem[] = [makeUploaded('a'), makeUploaded('b')];
    expect(hasPendingChanges(feedItems, ['a', 'b'])).toBe(false);
  });

  it('이미지가 삭제되면 true를 반환한다', () => {
    const feedItems: ImageItem[] = [makeUploaded('a')];
    expect(hasPendingChanges(feedItems, ['a', 'b'])).toBe(true);
  });

  it('순서가 바뀌면 true를 반환한다', () => {
    const feedItems: ImageItem[] = [makeUploaded('b'), makeUploaded('a')];
    expect(hasPendingChanges(feedItems, ['a', 'b'])).toBe(true);
  });

  it('아이템이 없고 원본도 비어있으면 false를 반환한다', () => {
    expect(hasPendingChanges([], [])).toBe(false);
  });
});

import { MAX_FILE_COUNT, MAX_FILE_SIZE } from '@/constants/uploadLimit';
import {
  buildFinalUrls,
  findOversizedFile,
  hasPendingChanges,
  reorderItems,
  sliceToLimit,
} from './photoEditUtils';
import { FeedItem, LocalItem } from './types';

const makeUploaded = (url: string): FeedItem => ({ type: 'uploaded', url });
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

describe('reorderItems', () => {
  const items: FeedItem[] = [
    makeUploaded('a'),
    makeUploaded('b'),
    makeUploaded('c'),
    makeUploaded('d'),
  ];

  it('앞에서 뒤로 이동한다 (0 → 2)', () => {
    const result = reorderItems(items, 0, 2);
    expect(result.map((i) => (i as { url: string }).url)).toEqual([
      'b',
      'a',
      'c',
      'd',
    ]);
  });

  it('뒤에서 앞으로 이동한다 (3 → 1)', () => {
    const result = reorderItems(items, 3, 1);
    expect(result.map((i) => (i as { url: string }).url)).toEqual([
      'a',
      'd',
      'b',
      'c',
    ]);
  });

  it('같은 위치로 이동해도 순서가 유지된다', () => {
    const result = reorderItems(items, 1, 1);
    expect(result.map((i) => (i as { url: string }).url)).toEqual([
      'a',
      'b',
      'c',
      'd',
    ]);
  });

  it('원본 배열을 변경하지 않는다 (불변성)', () => {
    reorderItems(items, 0, 3);
    expect(items).toHaveLength(4);
    expect((items[0] as { url: string }).url).toBe('a');
  });
});

describe('hasPendingChanges', () => {
  it('local 아이템이 있으면 true를 반환한다', () => {
    const feedItems: FeedItem[] = [makeUploaded('a'), makeLocal('new.jpg')];
    expect(hasPendingChanges(feedItems, ['a'])).toBe(true);
  });

  it('uploaded URL이 원본과 동일하면 false를 반환한다', () => {
    const feedItems: FeedItem[] = [makeUploaded('a'), makeUploaded('b')];
    expect(hasPendingChanges(feedItems, ['a', 'b'])).toBe(false);
  });

  it('이미지가 삭제되면 true를 반환한다', () => {
    const feedItems: FeedItem[] = [makeUploaded('a')];
    expect(hasPendingChanges(feedItems, ['a', 'b'])).toBe(true);
  });

  it('순서가 바뀌면 true를 반환한다', () => {
    const feedItems: FeedItem[] = [makeUploaded('b'), makeUploaded('a')];
    expect(hasPendingChanges(feedItems, ['a', 'b'])).toBe(true);
  });

  it('아이템이 없고 원본도 비어있으면 false를 반환한다', () => {
    expect(hasPendingChanges([], [])).toBe(false);
  });
});

describe('buildFinalUrls', () => {
  it('새로 올린 사진이 앞에 있어도 화면 순서를 그대로 유지한다', () => {
    const local = makeLocal('new.jpg');
    const feedItems: FeedItem[] = [local, makeUploaded('b'), makeUploaded('c')];
    const urlByFile = new Map([[local.file, 'a']]);
    expect(buildFinalUrls(feedItems, urlByFile)).toEqual(['a', 'b', 'c']);
  });

  it('새로 올린 사진이 중간에 있어도 화면 순서를 그대로 유지한다', () => {
    const local = makeLocal('new.jpg');
    const feedItems: FeedItem[] = [makeUploaded('a'), local, makeUploaded('c')];
    const urlByFile = new Map([[local.file, 'b']]);
    expect(buildFinalUrls(feedItems, urlByFile)).toEqual(['a', 'b', 'c']);
  });

  it('업로드에 실패해 URL이 없는 local 아이템은 제외한다', () => {
    const uploaded = makeLocal('ok.jpg');
    const failed = makeLocal('fail.jpg');
    const feedItems: FeedItem[] = [uploaded, makeUploaded('b'), failed];
    const urlByFile = new Map([[uploaded.file, 'a']]);
    expect(buildFinalUrls(feedItems, urlByFile)).toEqual(['a', 'b']);
  });

  it('local 아이템이 없으면 uploaded URL을 순서대로 반환한다', () => {
    const feedItems: FeedItem[] = [makeUploaded('b'), makeUploaded('a')];
    expect(buildFinalUrls(feedItems, new Map<File, string>())).toEqual([
      'b',
      'a',
    ]);
  });
});

import { reorderItems } from './reorderItems';
import { ImageItem } from './types';

const makeUploaded = (url: string): ImageItem => ({ type: 'uploaded', url });

describe('reorderItems', () => {
  const items: ImageItem[] = [
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

// useLoadedImages가 불러오기에 성공한 이미지 주소만 돌려주는지 확인하는 테스트
import { act, renderHook } from '@testing-library/react';
import useLoadedImages from './useLoadedImages';

const created: { src: string; onload: (() => void) | null }[] = [];

beforeEach(() => {
  created.length = 0;
  global.Image = class {
    src = '';
    onload: (() => void) | null = null;
    constructor() {
      created.push(this);
    }
  } as unknown as typeof Image;
});

it('불러오기에 성공한 주소만 담는다', () => {
  const { result } = renderHook(() =>
    useLoadedImages(['ok.jpg', 'broken.jpg']),
  );
  expect(result.current.size).toBe(0);

  act(() => created.find(({ src }) => src === 'ok.jpg')?.onload?.());

  expect([...result.current]).toEqual(['ok.jpg']);
});

import getAdjacentIndexes from './getAdjacentIndexes';

describe('getAdjacentIndexes', () => {
  it('현재 사진과 양옆을 돌려준다', () => {
    expect(getAdjacentIndexes(2, 5)).toEqual([1, 2, 3]);
  });

  it('loop라서 첫 장의 왼쪽은 마지막 장이다', () => {
    expect(getAdjacentIndexes(0, 5)).toEqual([4, 0, 1]);
  });

  it('loop라서 마지막 장의 오른쪽은 첫 장이다', () => {
    expect(getAdjacentIndexes(4, 5)).toEqual([3, 4, 0]);
  });

  it('사진이 1장이면 그 한 장뿐이다', () => {
    expect(getAdjacentIndexes(0, 1)).toEqual([0]);
  });

  it('사진이 2장이면 양옆이 같은 사진이라 중복 없이 두 장이다', () => {
    expect(getAdjacentIndexes(0, 2)).toEqual([1, 0]);
    expect(getAdjacentIndexes(1, 2)).toEqual([0, 1]);
  });

  it('사진이 없으면 빈 배열이다', () => {
    expect(getAdjacentIndexes(0, 0)).toEqual([]);
  });
});

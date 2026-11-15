/**
 * 현재 사진과 그 양옆 인덱스. 모달 Swiper가 loop라서 첫 장과 마지막 장은 서로 이웃이다.
 * 사진이 2장 이하면 양옆이 겹치므로 중복을 뺀다.
 */
const getAdjacentIndexes = (index: number, length: number): number[] => {
  if (length === 0) return [];
  const indexes = [index - 1, index, index + 1].map(
    (i) => (i + length) % length,
  );
  return [...new Set(indexes)];
};

export default getAdjacentIndexes;

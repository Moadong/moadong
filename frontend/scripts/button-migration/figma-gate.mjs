// 단계 ②의 판정: 시안 노드와 실제 페이지 요소의 토큰 일치·루트 크기를 본다 (figma-story-diff와 같은 기준).
export const SIZE_TOLERANCE_PX = 2;

const missing = (used, known) => [...used.keys()].filter((k) => !known.has(k));
const only = (a, b) => [...a.keys()].filter((k) => !b.has(k));

export function figmaGate({ figma, impl, theme }) {
  const parityIssues = [
    ...only(figma.colors, impl.colors).map((k) => `시안에만 색 ${k}`),
    ...only(impl.colors, figma.colors).map((k) => `구현에만 색 ${k}`),
    ...only(figma.typography, impl.typography).map(
      (k) => `시안에만 타이포 ${k}`,
    ),
    ...only(impl.typography, figma.typography).map(
      (k) => `구현에만 타이포 ${k}`,
    ),
  ];
  // theme에 없는 값은 "시안과 같은가"와 별개라 판정에서 뺀다. 이전 PR에서 theme에 추가한다.
  const tokenIssues = [
    ...missing(figma.colors, theme.colors).map((k) => `시안 색 ${k}`),
    ...missing(impl.colors, theme.colors).map((k) => `구현 색 ${k}`),
    ...missing(figma.typography, theme.typography).map(
      (k) => `시안 타이포 ${k}`,
    ),
    ...missing(impl.typography, theme.typography).map(
      (k) => `구현 타이포 ${k}`,
    ),
  ];
  // 반올림하지 않는다. 2.49px가 2로 접혀 통과하는 걸 막는다.
  const dw = impl.bbox.width - figma.bbox.width;
  const dh = impl.bbox.height - figma.bbox.height;
  const sizePass =
    Math.abs(dw) <= SIZE_TOLERANCE_PX && Math.abs(dh) <= SIZE_TOLERANCE_PX;
  return {
    pass: parityIssues.length === 0 && sizePass,
    sizePass,
    parityIssues,
    tokenIssues,
    dw,
    dh,
  };
}

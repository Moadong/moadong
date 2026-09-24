// figma-story-diff(scripts/figma-story-diff)가 생성·갱신한다. 손으로 고치지 말 것.
// Figma 시안에는 있지만 theme/에 없는 토큰의 보류 목록. theme/으로 옮기면 다음 실행에서 자동으로 빠진다.
export const pending = {
  colors: {},
  typography: {},
} as const;

export const BREAKPOINT = {
  mobile: 500, // ≤ 500
  tablet: 700, // ≤ 700
  laptop: 1280, // ≤ 1280
};

export const media = {
  mobile: `@media (max-width: ${BREAKPOINT.mobile}px)`,
  tablet: `@media (max-width: ${BREAKPOINT.tablet}px)`,
  laptop: `@media (max-width: ${BREAKPOINT.laptop}px)`,
  // 1281px 이상은 기본 스타일 (desktop)
};

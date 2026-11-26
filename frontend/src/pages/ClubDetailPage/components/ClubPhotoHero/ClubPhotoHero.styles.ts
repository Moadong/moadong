// 상단 사진 모자이크의 그리드·타일·대체 배경 스타일
import styled, { css } from 'styled-components';
import { media } from '@/styles/mediaQuery';
import { colors } from '@/styles/theme/colors';
import { transitions } from '@/styles/theme/transitions';
import { setTypography, typography } from '@/styles/theme/typography';

const DESKTOP_HEIGHT = 360;
const MOBILE_HEIGHT = 240;

// 타일 수에 따라 큰 사진 1장 + 나머지를 배치한다. 모바일은 최대 3장만 보인다.
const desktopGrid = (count: number) => {
  if (count === 1)
    return css`
      grid-template-columns: 1fr;
    `;
  if (count === 2)
    return css`
      grid-template-columns: 2fr 1fr;
    `;
  if (count === 3)
    return css`
      grid-template-columns: 2fr 1fr;
      grid-template-rows: 1fr 1fr;
    `;
  return css`
    grid-template-columns: 2fr 1fr 1fr;
    grid-template-rows: 1fr 1fr;
  `;
};

const mobileGrid = (count: number) => {
  if (count === 1)
    return css`
      grid-template-columns: 1fr;
      grid-template-rows: 1fr;
    `;
  if (count === 2)
    return css`
      grid-template-columns: 2fr 1fr;
      grid-template-rows: 1fr;
    `;
  return css`
    grid-template-columns: 2fr 1fr;
    grid-template-rows: 1fr 1fr;
  `;
};

export const Mosaic = styled.div<{ $count: number }>`
  position: relative;
  display: grid;
  gap: 4px;
  height: ${DESKTOP_HEIGHT}px;
  border-radius: 20px;
  overflow: hidden;
  ${({ $count }) => desktopGrid($count)};

  ${media.tablet} {
    height: ${MOBILE_HEIGHT}px;
    gap: 2px;
    border-radius: 0;
    ${({ $count }) => mobileGrid($count)};
  }
`;

export const Tile = styled.button<{ $index: number }>`
  position: relative;
  padding: 0;
  border: none;
  overflow: hidden;
  cursor: pointer;
  background-color: ${colors.gray[100]};

  /* 첫 사진은 세로 두 칸을 다 차지한다 */
  ${({ $index }) =>
    $index === 0 &&
    css`
      grid-row: 1 / -1;
    `};

  ${media.tablet} {
    /* 모바일은 큰 사진 1장 + 작은 사진 2장까지만 */
    ${({ $index }) =>
      $index > 2 &&
      css`
        display: none;
      `};
  }

  &:focus-visible {
    outline: 3px solid ${colors.primary[800]};
    outline-offset: -3px;
  }
`;

export const TileImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform ${transitions.duration.slow}
    ${transitions.easing.easeInOut};

  @media (hover: hover) {
    ${Tile}:hover & {
      transform: scale(1.03);
    }
  }
`;

export const MoreOverlay = styled.span`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.45);
  color: ${colors.base.white};
  ${setTypography(typography.title.title5)};

  ${media.tablet} {
    display: none;
  }
`;

// 모바일은 작은 사진 2장까지만 보이니 전체 사진으로 가는 버튼을 둔다 (데스크톱은 마지막 칸의 +N)
export const PhotoCount = styled.button`
  position: absolute;
  right: 12px;
  bottom: 12px;
  padding: 6px 12px;
  border: none;
  border-radius: 999px;
  background-color: rgba(0, 0, 0, 0.6);
  color: ${colors.base.white};
  ${setTypography(typography.button.button2)};
  cursor: pointer;
  display: none;

  ${media.tablet} {
    display: block;
  }
`;

export const Fallback = styled.div<{ $color?: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  border-radius: 20px;
  background-color: ${({ $color }) => $color ?? colors.primary[500]};

  ${media.tablet} {
    height: 160px;
    border-radius: 0;
  }
`;

export const FallbackLogo = styled.img`
  width: 96px;
  height: 96px;
  border-radius: 24px;
  object-fit: cover;
  opacity: 0.9;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);

  ${media.tablet} {
    width: 72px;
    height: 72px;
    border-radius: 18px;
  }
`;

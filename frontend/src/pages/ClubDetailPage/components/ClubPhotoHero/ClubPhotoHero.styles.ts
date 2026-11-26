// 상단 사진 모자이크의 그리드·타일·대체 배경 스타일
import styled, { css } from 'styled-components';
import {
  DETAIL_ASIDE_WIDTH,
  DETAIL_ASIDE_WIDTH_NARROW,
  DETAIL_COLUMN_GAP,
  DETAIL_COLUMN_GAP_NARROW,
  DETAIL_NARROW_MEDIA,
} from '@/pages/ClubDetailPage/detailLayout';
import { media } from '@/styles/mediaQuery';
import { colors } from '@/styles/theme/colors';
import { transitions } from '@/styles/theme/transitions';
import { setTypography, typography } from '@/styles/theme/typography';

const DESKTOP_HEIGHT = 360;
const MOBILE_HEIGHT = 240;
const TILE_GAP = 4;
const MOBILE_TILE_GAP = 2;

// 큰 사진 | 작은 사진 묶음. 오른쪽 묶음 폭·간격은 아래 지원 카드 칸과 같다
export const Mosaic = styled.div<{ $hasSide: boolean }>`
  position: relative;
  display: grid;
  grid-template-columns: ${({ $hasSide }) =>
    $hasSide ? `minmax(0, 1fr) ${DETAIL_ASIDE_WIDTH}px` : '1fr'};
  column-gap: ${DETAIL_COLUMN_GAP}px;
  height: ${DESKTOP_HEIGHT}px;

  > button:first-child {
    border-radius: 20px;
  }

  ${DETAIL_NARROW_MEDIA} {
    grid-template-columns: ${({ $hasSide }) =>
      $hasSide ? `minmax(0, 1fr) ${DETAIL_ASIDE_WIDTH_NARROW}px` : '1fr'};
    column-gap: ${DETAIL_COLUMN_GAP_NARROW}px;
  }

  ${media.tablet} {
    height: ${MOBILE_HEIGHT}px;
    grid-template-columns: ${({ $hasSide }) => ($hasSide ? '2fr 1fr' : '1fr')};
    column-gap: ${MOBILE_TILE_GAP}px;

    > button:first-child {
      border-radius: 0;
    }
  }
`;

// 작은 사진 수에 맞춘 배치: 1장 → 꽉, 2장 → 위아래, 3장 → 위 1·아래 2, 4장 → 2×2
const sideLayout = (count: number) => {
  if (count === 1)
    return css`
      grid-template: 1fr / 1fr;
    `;
  if (count === 2)
    return css`
      grid-template: 1fr 1fr / 1fr;
    `;
  if (count === 3)
    return css`
      grid-template: 1fr 1fr / 1fr 1fr;
      > :first-child {
        grid-column: 1 / -1;
      }
    `;
  return css`
    grid-template: 1fr 1fr / 1fr 1fr;
  `;
};

export const Side = styled.div<{ $count: number }>`
  display: grid;
  gap: ${TILE_GAP}px;
  border-radius: 20px;
  overflow: hidden;
  ${({ $count }) => sideLayout($count)};

  ${media.tablet} {
    gap: ${MOBILE_TILE_GAP}px;
    border-radius: 0;
    grid-template: ${({ $count }) => ($count >= 2 ? '1fr 1fr' : '1fr')} / 1fr;

    > :first-child {
      grid-column: auto;
    }

    /* 모바일은 작은 사진 2장까지만 */
    > :nth-child(n + 3) {
      display: none;
    }
  }
`;

export const Tile = styled.button`
  position: relative;
  padding: 0;
  border: none;
  overflow: hidden;
  cursor: pointer;
  background-color: ${colors.gray[100]};

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

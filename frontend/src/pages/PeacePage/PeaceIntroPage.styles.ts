import styled from 'styled-components';
import {
  ButtonArea,
  FIXED_BOTTOM_BUTTON_AREA_HEIGHT,
} from '@/components/common/FixedBottomButtonArea/FixedBottomButtonArea.styles';
import { BREAKPOINT, media } from '@/styles/mediaQuery';
import { setTypography } from '@/styles/theme/typography';
import { PEACE_COLUMN_MAX_WIDTH } from './constants/layout';
import { PEACE_GREEN } from './constants/peaceColors';

export const Hero = styled.section`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 16px;

  ${media.tablet} {
    /* 아래 고정 버튼에 가리지 않게 */
    padding-bottom: ${FIXED_BOTTOM_BUTTON_AREA_HEIGHT}px;
  }
`;

export const Dove = styled.img`
  width: 96px;
  height: 96px;
  margin-bottom: 8px;
  filter: drop-shadow(0 12px 24px ${PEACE_GREEN.shadow});
`;

export const Eyebrow = styled.p`
  ${({ theme }) => setTypography(theme.typography.paragraph.p2)};
  color: ${PEACE_GREEN.main};
`;

export const Title = styled.h1`
  ${({ theme }) => setTypography(theme.typography.title.title2)};
  color: ${({ theme }) => theme.colors.base.black};
`;

export const Description = styled.p`
  ${({ theme }) => setTypography(theme.typography.paragraph.p1)};
  color: ${({ theme }) => theme.colors.gray[700]};
  white-space: pre-line;
`;

const TABLET_ONLY = `@media (min-width: ${BREAKPOINT.mobile + 1}px) and (max-width: ${BREAKPOINT.tablet}px)`;
const DESKTOP_UP = `@media (min-width: ${BREAKPOINT.tablet + 1}px)`;

/**
 * 모바일·태블릿은 동아리 상세의 '지원하기'(FixedBottomButtonArea)와 같은 고정 영역을 그대로 쓴다.
 * 넓은 화면에서는 고정하지 않고 본문 칼럼 맨 아래에 둔다
 */
export const StartArea = styled(ButtonArea)`
  /* 공통 영역은 최대 500px이라 본문 칼럼 밖으로 나온다. 칼럼 폭으로 줄인다 */
  ${TABLET_ONLY} {
    max-width: ${PEACE_COLUMN_MAX_WIDTH}px;
  }

  ${DESKTOP_UP} {
    position: static;
    margin-top: auto;
    padding: 0 0 24px;
    background: transparent;
    box-shadow: none;

    button {
      width: 100%;
      height: 56px;
      border-radius: 16px;
      ${({ theme }) => setTypography(theme.typography.title.title6)};
    }
  }
`;

export const StartButton = styled.button`
  border: none;
  background: ${PEACE_GREEN.main};
  color: ${({ theme }) => theme.colors.base.white};
  cursor: pointer;

  &:active {
    transform: scale(0.98);
  }
`;

import styled from 'styled-components';
import MoreArrowIcon from '@/assets/images/icons/more_arraw_icon.svg?react';
import { colors } from '@/styles/theme/colors';
import { setTypography, typography } from '@/styles/theme/typography';

export const Wrapper = styled.div`
  position: relative;
  flex-shrink: 0;
  z-index: 7;

  li {
    ${setTypography(typography.paragraph.p5)}
  }
`;

export const Trigger = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 8px 20px;
  gap: 6px;
  width: 94px;
  height: 36px;
  background: ${colors.base.white};
  box-shadow: inset 1px 0 0 ${colors.gray[200]};
  cursor: pointer;
  box-sizing: border-box;
`;

export const Label = styled.span`
  ${setTypography(typography.paragraph.p5)}
  color: ${colors.gray[700]};
  white-space: nowrap;
`;

export const Chevron = styled(MoreArrowIcon)<{ $isOpen: boolean }>`
  width: 12px;
  height: 6px;
  flex-shrink: 0;
  color: ${colors.gray[500]};

  /* 선 굵기 1.8의 둥근 끝이 높이 6px viewBox 밖으로 나가 잘리지 않게 한다 */
  overflow: visible;

  path {
    stroke-width: 1.8;
  }
  transform: ${({ $isOpen }) => ($isOpen ? 'rotate(180deg)' : 'rotate(0deg)')};
`;

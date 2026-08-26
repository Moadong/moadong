import styled from 'styled-components';
import MoreArrowIcon from '@/assets/images/icons/more_arraw_icon.svg?react';
import { colors } from '@/styles/theme/colors';
import { setTypography, typography } from '@/styles/theme/typography';

export const Wrapper = styled.div`
  position: relative;
  flex-shrink: 0;

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
  border-left: 1px solid ${colors.gray[200]};
  cursor: pointer;
  box-sizing: border-box;
`;

export const Label = styled.span`
  ${setTypography(typography.paragraph.p5)}
  color: ${colors.gray[700]};
  white-space: nowrap;
`;

export const Chevron = styled(MoreArrowIcon)<{ $isOpen: boolean }>`
  width: 14px;
  height: 14px;
  flex-shrink: 0;
  color: ${colors.gray[500]};
  transform: ${({ $isOpen }) => ($isOpen ? 'rotate(180deg)' : 'rotate(0deg)')};
  transition: transform 0.2s;
`;

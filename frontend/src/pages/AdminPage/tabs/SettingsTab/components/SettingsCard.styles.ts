import styled from 'styled-components';
import RightArrowSvg from '@/assets/images/icons/right_arrow_icon.svg?react';
import { colors } from '@/styles/theme/colors';
import { setTypography, typography } from '@/styles/theme/typography';

export const Card = styled.div`
  display: flex;
  flex-direction: column;
  background: ${colors.gray[50]};
  border: 1px solid ${colors.gray[300]};
  border-radius: 14px;
  padding: 20px 14px 20px 20px;
  gap: 16px;
`;

export const CategoryLabel = styled.p`
  ${setTypography(typography.button.button1)}
  line-height: 140%;
  color: ${colors.gray[600]};
`;

export const ItemList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const Item = styled.button`
  all: unset;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  cursor: pointer;
`;

export const ItemLabel = styled.span`
  ${setTypography(typography.paragraph.p2)}
  line-height: 140%;
  color: ${colors.base.black};
`;

export const ChevronIcon = styled(RightArrowSvg)`
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  color: ${colors.gray[500]};
`;

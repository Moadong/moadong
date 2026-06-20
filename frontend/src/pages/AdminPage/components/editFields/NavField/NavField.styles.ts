import styled from 'styled-components';
import { colors } from '@/styles/theme/colors';
import { setTypography, typography } from '@/styles/theme/typography';

export const ContentText = styled.span`
  ${setTypography(typography.paragraph.p2)}
  line-height: 140%;
  color: ${colors.base.black};
`;

export const EmptyText = styled.span`
  ${setTypography(typography.paragraph.p2)}
  line-height: 140%;
  color: ${colors.gray[500]};
`;

export const ContentRow = styled.button`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  min-height: 24px;
  cursor: pointer;
  background: none;
  border: none;
  padding: 0;
  text-align: left;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  gap: 5px;
  flex: 1;
  min-width: 0;
`;

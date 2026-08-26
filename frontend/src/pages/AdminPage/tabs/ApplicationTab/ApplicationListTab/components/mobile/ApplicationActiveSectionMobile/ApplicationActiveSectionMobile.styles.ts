import styled from 'styled-components';
import { colors } from '@/styles/theme/colors';
import { setTypography, typography } from '@/styles/theme/typography';

export const CardList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const EmptyBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 16px 18px;
  height: 75px;
  width: 335px;
  background-color: ${colors.gray[50]};
  border: 1px solid ${colors.gray[300]};
  border-radius: 14px;
  box-sizing: border-box;
`;

export const EmptyTitle = styled.span`
  ${setTypography(typography.paragraph.p2)}
  text-align: center;
  color: ${colors.gray[700]};
`;

export const EmptyDescription = styled.span`
  ${setTypography(typography.etc.medium12)}
  text-align: center;
  color: ${colors.gray[600]};
`;

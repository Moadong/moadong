import styled from 'styled-components';
import { colors } from '@/styles/theme/colors';
import { setTypography, typography } from '@/styles/theme/typography';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 60px;
`;

export const FieldWrapper = styled.div<{ $hasError?: boolean }>`
  position: relative;
  padding-bottom: ${({ $hasError }) => ($hasError ? '10px' : '0')};
`;

export const GuidanceBox = styled.div`
  padding: 16px;
  background-color: ${colors.gray[100]};
  border-radius: 8px;
  border: 1px solid ${colors.gray[300]};
`;

export const GuidanceText = styled.p`
  ${setTypography(typography.paragraph.p6)};
  color: ${colors.gray[700]};
  margin: 0;

  & + & {
    margin-top: 8px;
  }
`;

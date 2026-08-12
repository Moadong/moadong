import styled from 'styled-components';
import { setTypography, typography } from '@/styles/theme/typography';

export const Tag = styled.span<{ $backgroundColor: string; $color: string }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  height: 25px;
  padding: 4px 8px;
  border-radius: 8px;
  background: ${({ $backgroundColor }) => $backgroundColor};
  ${setTypography(typography.button.button2)};
  color: ${({ $color }) => $color};
  letter-spacing: -0.24px;
  white-space: nowrap;
`;

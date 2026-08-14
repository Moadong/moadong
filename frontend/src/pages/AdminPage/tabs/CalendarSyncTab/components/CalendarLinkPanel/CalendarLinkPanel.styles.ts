import styled from 'styled-components';
import { setTypography, typography } from '@/styles/theme/typography';

export const ErrorText = styled.p`
  margin: 0;
  color: #dc2626;
  ${setTypography(typography.button.button2)};
`;

import styled from 'styled-components';
import { colors } from '@/styles/theme/colors';
import { setTypography, typography } from '@/styles/theme/typography';

export const ErrorText = styled.p`
  margin: 0;
  color: ${colors.primary[900]};
  ${setTypography(typography.button.button2)};
`;

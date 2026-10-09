import styled from 'styled-components';
import { colors } from '@/styles/theme/colors';
import { setTypography, typography } from '@/styles/theme/typography';

export const Button = styled.button<{ $active: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  padding: 9px 16px;
  ${setTypography(typography.button.button1)};
  cursor: pointer;
  transition:
    background-color 0.12s ease,
    transform 0.06s ease;

  color: ${({ $active }) => ($active ? colors.base.white : colors.gray[700])};
  background-color: ${({ $active }) =>
    $active ? colors.primary[800] : colors.gray[300]};
  border: ${({ $active }) =>
    $active ? `1px solid transparent` : `1px solid ${colors.gray[500]}`};

  &:active {
    transform: translateY(1px);
  }
`;

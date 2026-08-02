import styled from 'styled-components';
import { colors } from '@/styles/theme/colors';
import { setTypography, typography } from '@/styles/theme/typography';

export const Container = styled.div`
  display: flex;
  gap: 4px;
  overflow-x: auto;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const Pill = styled.button<{ $active: boolean }>`
  flex-shrink: 0;
  height: 32px;
  padding: 6px 12px;
  border-radius: 100px;
  border: none;
  cursor: pointer;
  transition:
    background 0.15s,
    color 0.15s;

  ${({ $active }) =>
    $active
      ? `
    background: ${colors.gray[800]};
    color: ${colors.base.white};
    ${setTypography(typography.button.button1)}
  `
      : `
    background: ${colors.gray[100]};
    color: ${colors.gray[600]};
    ${setTypography(typography.paragraph.p6)}
  `}
`;

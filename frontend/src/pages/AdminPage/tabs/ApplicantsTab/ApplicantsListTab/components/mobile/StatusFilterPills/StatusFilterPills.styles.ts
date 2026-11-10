import styled, { css } from 'styled-components';
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
      ? css`
          /* 시안은 gray[800] 위에 검정 20%를 두 겹 덮는다 */
          background:
            linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)),
            linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)),
            ${colors.gray[800]};
          color: ${colors.base.white};
          ${setTypography(typography.button.button1)}
        `
      : css`
          background: ${colors.gray[100]};
          color: ${colors.gray[600]};
          ${setTypography(typography.paragraph.p6)}
        `}
`;

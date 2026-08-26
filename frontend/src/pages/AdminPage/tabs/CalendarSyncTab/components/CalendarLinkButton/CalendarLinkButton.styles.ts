import styled, { css } from 'styled-components';
import Button from '@/components/common/Button/Button';
import { colors } from '@/styles/theme/colors';
import { setTypography, typography } from '@/styles/theme/typography';
import type { CalendarLinkStatus } from './CalendarLinkButton';

const BACKGROUNDS: Record<CalendarLinkStatus, string> = {
  idle: colors.primary[800],
  loading: colors.gray[900],
  connected: colors.accent[1][900],
};

export const LoadingLabel = styled.span``;

/** 진행 중 버튼에 마우스를 올리면 '취소'로 바뀐다 */
export const CancelLabel = styled.span`
  display: none;
`;

export const LinkButton = styled(Button)<{ $status: CalendarLinkStatus }>`
  min-width: 88px;
  height: 37px;
  gap: 2px;
  padding: 0 12px;
  border-radius: 14px;
  white-space: nowrap;
  letter-spacing: -0.24px;
  ${setTypography(typography.button.button2)};
  background-color: ${({ $status }) => BACKGROUNDS[$status]};
  color: ${colors.base.white};

  &:hover:not(:disabled) {
    background-color: ${({ $status }) => BACKGROUNDS[$status]};
  }

  ${({ $status }) =>
    $status === 'loading' &&
    css`
      &:hover:not(:disabled) {
        background-color: ${colors.gray[500]};

        ${LoadingLabel} {
          display: none;
        }

        ${CancelLabel} {
          display: inline;
        }
      }
    `}
`;

import styled from 'styled-components';
import { media } from '@/styles/mediaQuery';
import { colors } from '@/styles/theme/colors';
import { setTypography, typography } from '@/styles/theme/typography';

export const MobileContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding-bottom: calc(80px + env(safe-area-inset-bottom) + 40px);
  width: 100%;
  max-width: 500px;
  min-height: 100vh;
  margin: 0 auto;
  box-shadow: 0px 2px 12px rgba(0, 0, 0, 0.04);

  ${media.mobile} {
    max-width: 100%;
    margin: 0;
    box-shadow: none;
  }
`;

export const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
  padding: 32px 20px 0;
`;

export const PageTitle = styled.h2`
  ${setTypography(typography.title.title5)}
  color: ${colors.base.black};
  margin: 0;
`;

export const PageSubtitle = styled.p`
  ${setTypography(typography.button.button1)}
  color: ${colors.gray[700]};
  margin: -22px 0 0;
`;

export const FieldList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const PeriodSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const SectionLabel = styled.span`
  ${setTypography(typography.button.button1)}
  color: ${colors.gray[900]};
  padding: 0 2px;
`;

export const DateTimeRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const DateTimeInput = styled.input<{ $isDisabled?: boolean }>`
  width: 100%;
  height: 45px;
  padding: 0 14px;
  border: none;
  border-radius: 12px;
  background-color: ${({ $isDisabled }) =>
    $isDisabled ? colors.gray[400] : colors.gray[200]};
  color: ${({ $isDisabled }) =>
    $isDisabled ? colors.gray[500] : colors.gray[700]};
  font-size: 1rem;
  pointer-events: ${({ $isDisabled }) => ($isDisabled ? 'none' : 'auto')};

  &::-webkit-calendar-picker-indicator {
    ${({ $isDisabled }) => $isDisabled && `filter: invert(77%);`}
  }
`;

export const AlwaysRecruitButton = styled.button<{ $isAlwaysActive: boolean }>`
  align-self: flex-start;
  border-radius: 10px;
  padding: 0 18px;
  height: 40px;
  ${setTypography(typography.button.button1)}
  cursor: pointer;

  color: ${colors.gray[700]};
  background-color: ${colors.gray[300]};
  border: 1px solid ${colors.gray[400]};

  ${({ $isAlwaysActive }) =>
    $isAlwaysActive &&
    `
    color: ${colors.base.white};
    background-color: ${colors.primary[800]};
    border: none;
  `}

  transition:
    background-color 0.12s ease,
    transform 0.06s ease;

  &:active {
    transform: translateY(1px);
  }
`;

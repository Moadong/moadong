import styled from 'styled-components';
import { colors } from '@/styles/theme/colors';
import { setTypography, typography } from '@/styles/theme/typography';

export const Dialog = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 280px;
  border: 1px solid ${colors.gray[200]};
  border-radius: 14px;
  background: ${colors.base.white};
  overflow: hidden;
`;

export const Body = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  width: 100%;
  padding: 16px 24px 20px;
`;

export const Title = styled.p`
  ${setTypography(typography.title.title6)};
  color: ${colors.base.black};
  text-align: center;
  letter-spacing: -0.32px;
`;

export const PeriodDescription = styled.p`
  ${setTypography(typography.paragraph.p5)};
  color: ${colors.gray[600]};
  text-align: center;
  letter-spacing: -0.28px;
  margin-bottom: 8px;
`;

export const FieldsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;

  & > *:last-child {
    margin-top: 4px;
  }
`;

export const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
`;

export const FieldLabel = styled.span`
  ${setTypography(typography.paragraph.p7)};
  color: ${colors.gray[800]};
  font-weight: 600;
  letter-spacing: -0.24px;
`;

export const InputRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const InputFieldWrapper = styled.div`
  flex: 0 0 64px;
  max-width: 64px;
  overflow: hidden;

  input {
    height: 38px;
    padding: 0 8px;
    text-align: center;
    font-size: 14px;
    min-width: 0;

    &::placeholder {
      font-size: 14px;
    }
  }
`;

export const InputSuffix = styled.span`
  ${setTypography(typography.paragraph.p5)};
  color: ${colors.gray[700]};
  letter-spacing: -0.28px;
  white-space: nowrap;
`;

export const Preview = styled.span<{ $empty?: boolean }>`
  ${setTypography(typography.paragraph.p7)};
  color: ${({ $empty }) => ($empty ? colors.gray[400] : colors.primary[800])};
  letter-spacing: -0.24px;
  white-space: nowrap;
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${colors.gray[200]};
  width: calc(100% + 48px);
  margin: 0 -24px;
`;

export const AlwaysToggleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;

  button {
    width: 100%;
    letter-spacing: -0.28px;
  }
`;

export const AlwaysToggleHint = styled.span`
  ${setTypography(typography.paragraph.p7)};
  color: ${colors.gray[400]};
  text-align: center;
  letter-spacing: -0.24px;
`;

export const Footer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  height: 44px;
  border-top: 1px solid ${colors.gray[200]};
`;

export const FooterButton = styled.button<{ $emphasized?: boolean }>`
  flex: 1;
  height: 100%;
  padding: 12px 10px;
  border: none;
  background: transparent;
  cursor: pointer;
  letter-spacing: -0.28px;
  ${({ $emphasized }) =>
    $emphasized
      ? setTypography(typography.button.button1)
      : setTypography(typography.paragraph.p5)};
  color: ${({ $emphasized }) =>
    $emphasized ? colors.primary[800] : colors.gray[700]};

  &:disabled {
    color: ${({ $emphasized }) =>
      $emphasized ? colors.primary[800] : colors.gray[700]};
    opacity: 0.35;
    cursor: not-allowed;
  }

  & + & {
    border-left: 1px solid ${colors.gray[200]};
  }
`;

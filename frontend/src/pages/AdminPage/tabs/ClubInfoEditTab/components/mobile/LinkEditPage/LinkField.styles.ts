import styled from 'styled-components';
import { colors } from '@/styles/theme/colors';
import { setTypography, typography } from '@/styles/theme/typography';

export const ContentRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  width: 100%;
  min-height: 22px;
`;

export const Input = styled.input<{ $hasValue: boolean }>`
  flex: 1;
  min-width: 0;
  border: none;
  outline: none;
  background: transparent;
  padding: 0;

  ${setTypography(typography.paragraph.p4)}
  line-height: 140%;
  color: ${({ $hasValue }) =>
    $hasValue ? colors.accent[1][900] : colors.base.black};

  &::placeholder {
    color: ${colors.gray[500]};
  }
`;

export const ClearButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  padding: 0;
  background: none;
  border: none;
  cursor: pointer;
  flex-shrink: 0;
`;

export const ErrorMessage = styled.span`
  display: block;
  margin-top: 4px;
  padding: 0 4px;
  ${setTypography(typography.paragraph.p7)}
  color: ${colors.primary[900]};
`;

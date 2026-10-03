import styled from 'styled-components';
import { colors } from '@/styles/theme/colors';
import { setTypography, typography } from '@/styles/theme/typography';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
`;

export const Card = styled.div<{ $isError?: boolean }>`
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 12px 14px;
  gap: 10px;
  width: 100%;
  height: 46px;
  background: ${colors.base.white};
  border: 1px solid
    ${({ $isError }) => ($isError ? colors.primary[900] : colors.gray[200])};
  border-radius: 10px;

  &:focus-within {
    border-color: ${({ $isError }) =>
      $isError ? colors.primary[900] : colors.gray[800]};
  }
`;

export const Input = styled.input`
  flex: 1;
  min-width: 0;
  border: none;
  outline: none;
  background: transparent;
  ${setTypography(typography.paragraph.p5)};
  color: ${colors.gray[900]};
  letter-spacing: -0.02em;

  &::placeholder {
    font-weight: 400;
    color: ${colors.gray[500]};
  }
`;

export const ClearButton = styled.button`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;

  svg {
    width: 18px;
    height: 18px;
  }
`;

export const ToggleButton = styled.button`
  flex-shrink: 0;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  ${setTypography(typography.button.button2)};
  color: ${colors.gray[500]};
`;

export const HelperText = styled.span`
  ${setTypography(typography.button.button2)};
  color: ${colors.primary[900]};
  letter-spacing: -0.02em;
  padding: 0 4px;
`;

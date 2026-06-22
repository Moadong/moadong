import styled from 'styled-components';
import { media } from '@/styles/mediaQuery';
import { colors } from '@/styles/theme/colors';
import { setTypography, typography } from '@/styles/theme/typography';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding-bottom: 100px;
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

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px;
`;

export const TagInputRow = styled.div<{ $hasValue: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 4px 8px;
  gap: 2px;
  height: 25px;
  border-radius: 8px;
  background: ${({ $hasValue }) =>
    $hasValue ? colors.gray[200] : 'transparent'};
  border: ${({ $hasValue }) =>
    $hasValue
      ? `1px solid ${colors.gray[300]}`
      : `1px dashed ${colors.gray[400]}`};
`;

export const HashSymbol = styled.span<{ $hasValue: boolean }>`
  ${setTypography(typography.button.button2)}
  color: ${({ $hasValue }) =>
    $hasValue ? colors.base.black : colors.gray[400]};
`;

export const TagInput = styled.input`
  border: none;
  outline: none;
  background: transparent;
  flex: 1;
  ${setTypography(typography.button.button2)}
  color: ${colors.base.black};

  &::placeholder {
    color: ${colors.gray[400]};
  }
`;

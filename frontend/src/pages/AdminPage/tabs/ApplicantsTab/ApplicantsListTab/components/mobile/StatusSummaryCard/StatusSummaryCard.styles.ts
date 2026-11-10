import styled from 'styled-components';
import { colors } from '@/styles/theme/colors';
import { setTypography, typography } from '@/styles/theme/typography';

export const Card = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 12px 10px;
  height: 65px;
  width: 100%;
  background: ${colors.gray[50]};
  box-shadow: inset 0 0 0 1px ${colors.gray[200]};
  border-radius: 14px;
  box-sizing: border-box;
`;

export const Item = styled.div`
  flex-shrink: 0;
  width: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
`;

export const Divider = styled.div`
  flex-shrink: 0;
  width: 1px;
  height: 30px;
  margin: 0 -0.5px;
  background: ${colors.gray[300]};
  border-radius: 100px;
`;

export const Label = styled.span`
  ${setTypography(typography.button.button2)}
  color: ${colors.gray[600]};
`;

export const Count = styled.span<{ $isTotal: boolean }>`
  ${setTypography(typography.title.title6)}
  color: ${({ $isTotal }) =>
    $isTotal ? colors.primary[800] : colors.base.black};
`;

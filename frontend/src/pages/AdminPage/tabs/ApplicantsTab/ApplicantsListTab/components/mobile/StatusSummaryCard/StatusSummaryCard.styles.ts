import styled from 'styled-components';
import { colors } from '@/styles/theme/colors';
import { setTypography, typography } from '@/styles/theme/typography';

export const Card = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  padding: 12px 0;
  height: 65px;
  width: 100%;
  background: ${colors.gray[50]};
  border: 1px solid ${colors.gray[200]};
  border-radius: 14px;
  box-sizing: border-box;
`;

export const Item = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  position: relative;

  &:not(:last-child)::after {
    content: '';
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 1px;
    height: 30px;
    background: ${colors.gray[300]};
    border-radius: 100px;
  }
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

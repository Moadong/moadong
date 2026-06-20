import styled from 'styled-components';
import { colors } from '@/styles/theme/colors';

export const Card = styled.div<{ $isActive?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 5px;
  padding: 14px 18px;
  background-color: ${colors.gray[50]};
  border: 1px solid
    ${({ $isActive }) => ($isActive ? colors.gray[800] : colors.gray[200])};
  border-radius: 14px;
`;

export const Label = styled.span`
  font-family: 'Pretendard';
  font-weight: 500;
  font-size: 12px;
  line-height: 140%;
  letter-spacing: -0.02em;
  color: ${colors.gray[600]};
`;

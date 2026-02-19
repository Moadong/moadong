import styled from 'styled-components';
import { colors } from '@/styles/theme/colors';

export const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  position: relative;
`;

export const Input = styled.button<{ $active?: boolean }>`
  min-width: 270px;
  height: 45px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  font-size: 16px;
  font-weight: 400;

  background: ${({ $active }) =>
    $active ? colors.primary[800] : colors.gray[100]};
  color: ${({ $active }) =>
    $active ? colors.base.white : colors.gray[700]};
`;

export const Tilde = styled.span`
  font-size: 20px;
  font-weight: 600;
  color: ${colors.gray[500]};
`;

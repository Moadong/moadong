import styled from 'styled-components';
import { colors } from '@/styles/theme/colors';

export const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  position: relative;
  z-index: 10;
`;

export const Input = styled.button<{ $active?: boolean }>`
  min-width: 260px;
  height: 45px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  font-size: 15px;

  background: ${({ $active }) =>
    $active ? colors.primary[800] : colors.gray[100]};
  color: ${({ $active }) =>
    $active ? colors.base.white : colors.gray[700]};
`;

export const Tilde = styled.span`
  font-size: 20px;
  font-weight: 600;
`;

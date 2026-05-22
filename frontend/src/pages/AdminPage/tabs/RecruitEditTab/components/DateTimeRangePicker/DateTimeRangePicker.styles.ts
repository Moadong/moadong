import styled, { css } from 'styled-components';
import { colors } from '@/styles/theme/colors';

export const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  position: relative;
`;

export const Input = styled.button<{ $isActive?: boolean }>`
  min-width: 270px;
  height: 45px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  font-size: 16px;
  font-weight: 400;

  background-color: ${colors.gray[100]};
  color: ${colors.gray[700]};

  ${({ $isActive }) =>
    $isActive &&
    css`
      background-color: ${colors.primary[800]};
      color: ${colors.base.white};
    `}

  &:disabled {
    background-color: ${colors.gray[400]};
    color: ${colors.gray[500]};
  }
`;

export const Tilde = styled.span`
  font-size: 20px;
  font-weight: 600;
  color: ${colors.gray[500]};
`;

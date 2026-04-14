import styled from 'styled-components';
import { colors } from '@/styles/theme/colors';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${colors.base.white};
  border-radius: 16px;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
  width: 40px;
`;

export const Button = styled.button`
  width: 40px;
  height: 40px;
  padding: 10px;
  border: none;
  background-color: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: ${colors.gray[100]};
  }

  &:first-child {
    border-radius: 16px 16px 0 0;
  }

  &:last-child {
    border-radius: 0 0 16px 16px;
  }
`;

export const Divider = styled.div`
  width: 40px;
  height: 1px;
  background-color: ${colors.gray[300]};
`;

export const PlusIcon = styled.span`
  position: relative;
  width: 18px;
  height: 18px;

  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    background-color: ${colors.gray[600]};
    border-radius: 1px;
  }

  &::before {
    width: 18px;
    height: 2.5px;
    transform: translate(-50%, -50%);
  }

  &::after {
    width: 2.5px;
    height: 18px;
    transform: translate(-50%, -50%);
  }
`;

export const MinusIcon = styled.span`
  position: relative;
  width: 18px;
  height: 2.5px;
  background-color: ${colors.gray[600]};
  border-radius: 1px;
`;

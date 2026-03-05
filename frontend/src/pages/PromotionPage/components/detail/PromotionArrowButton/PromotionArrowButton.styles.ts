import styled from 'styled-components';
import { colors } from '@/styles/theme/colors';

export const Button = styled.button`
  width: 100%;
  margin-top: 12px;
  padding: 14px;
  border-radius: 12px;
  background: ${colors.gray[100]};
  border: 1px solid ${colors.gray[400]};
  cursor: pointer;
  font-size: 16px;
  font-weight: 700;
  color: ${colors.gray[800]};

  display: flex;
  justify-content: center;
`;

export const Content = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const Arrow = styled.span<{ $direction: string }>`
  display: flex;
  transition: transform 0.25s ease;

  transform: ${({ $direction }) => {
    switch ($direction) {
      case 'up':
        return 'rotate(180deg)';
      case 'right':
        return 'rotate(-90deg)';
      case 'left':
        return 'rotate(90deg)';
      default:
        return 'rotate(0deg)';
    }
  }};
`;
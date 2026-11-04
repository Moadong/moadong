import styled from 'styled-components';
import { colors } from '@/styles/theme/colors';

interface ButtonProps {
  $selected: boolean;
  $color?: string;
}

export const Button = styled.button<ButtonProps>`
  font-size: 0.875rem;
  padding: 5px 8px;
  border-radius: 4px;
  border: none;
  transition: all 0.1s;
  font-weight: 600;
  cursor: pointer;
  background-color: ${(props) =>
    props.$selected
      ? props.$color || colors.primary[900]
      : 'rgba(0, 0, 0, 0.05)'};
  color: ${(props) => (props.$selected ? colors.gray[900] : colors.gray[800])};

  &:hover {
    opacity: ${(props) => (props.$selected ? 0.9 : 1)};
    background-color: ${(props) =>
      props.$selected ? props.$color || '#ea580c' : '#d1d5db'};
  }
`;

export const Container = styled.div`
  display: flex;
  gap: 12px;
`;

export const Label = styled.p`
  font-size: 1.125rem;
  margin-bottom: 12px;
  font-weight: 600;
`;

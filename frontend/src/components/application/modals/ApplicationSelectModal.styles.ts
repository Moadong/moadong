import { colors } from '@/styles/theme/colors';
import styled from 'styled-components';

export const EmptyMessage = styled.div`
  padding: 16px 8px;
  color: ${colors.gray[600]};
  text-align: center;
  font-weight: 600;
`;

export const List = styled.div`
  display: grid;
  gap: 16px;
`;

export const OptionButton = styled.button`
  width: 100%;
  padding: 18px 20px;
  border-radius: 10px;
  border: 1px solid ${colors.gray[400]};
  background: ${colors.base.white};
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition:
    background-color 0.15s ease,
    color 0.15s ease,
    border-color 0.15s ease;

  &:hover {
    background: ${colors.primary[800]};
    color: ${colors.base.white};
    border-color: ${colors.primary[800]};
  }
`;

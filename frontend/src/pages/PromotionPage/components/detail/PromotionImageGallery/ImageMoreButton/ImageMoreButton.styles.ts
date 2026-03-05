import styled from 'styled-components';
import { colors } from '@/styles/theme/colors';

export const Button = styled.button`
  width: 100%;
  margin-top: 12px;
  padding: 14px;
  border-radius: 10px;
  background: ${colors.gray[100]};
  border: 1px solid ${colors.gray[400]};
  cursor: pointer;
  font-weight: 600;

  &:hover {
    background: ${colors.gray[300]};
  }
`;
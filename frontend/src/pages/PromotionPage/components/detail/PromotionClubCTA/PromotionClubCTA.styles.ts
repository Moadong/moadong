import styled from 'styled-components';
import { colors } from '@/styles/theme/colors';

export const Container = styled.section`
  padding: 0px 20px 24px 20px;
`;

export const Question = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: ${colors.gray[800]};
  margin-bottom: 12px;
`;

export const Button = styled.button`
  width: 100%;
  padding: 14px;
  border-radius: 12px;

  background: ${colors.gray[200]};
  border: none;
  cursor: pointer;
  font-weight: 600;

  &:active {
    background: ${colors.gray[300]};
  }
`;

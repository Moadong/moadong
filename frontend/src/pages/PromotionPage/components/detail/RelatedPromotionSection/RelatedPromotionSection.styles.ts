import styled from 'styled-components';
import { colors } from '@/styles/theme/colors';

export const Container = styled.section`
  padding: 20px;
  background-color: ${colors.gray[300]};
`;

export const Title = styled.h3`
  font-size: 20px;
  font-weight: 700;
  color: ${colors.gray[800]};
  margin-bottom: 12px;
`;

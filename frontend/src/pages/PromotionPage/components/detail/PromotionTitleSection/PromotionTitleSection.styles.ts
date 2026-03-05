import styled from 'styled-components';
import { colors } from '@/styles/theme/colors';

export const Container = styled.section`
  padding: 20px 21.5px 20px 21.5px;

  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

export const TagWrapper = styled.div`
  margin-bottom: 8px;
`;

export const Title = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: ${colors.gray[800]};
  word-break: keep-all;
`;
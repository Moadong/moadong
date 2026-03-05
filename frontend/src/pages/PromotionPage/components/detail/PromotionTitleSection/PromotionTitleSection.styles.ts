import styled from 'styled-components';
import { colors } from '@/styles/theme/colors';

export const Container = styled.section`
  padding: 16px 18px 8px 18px;

  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

export const TagWrapper = styled.div`
  margin-bottom: 10px;
`;

export const Title = styled.h2`
  font-size: 18px;
  font-weight: 700;
  color: ${colors.gray[900]};
  line-height: 1.4;
  word-break: keep-all;
`;
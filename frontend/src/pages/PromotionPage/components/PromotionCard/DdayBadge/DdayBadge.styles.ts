import { colors } from '@/styles/theme/colors';
import styled from 'styled-components';

export const Container = styled.div`
  border-radius: 50px;
  background-color: ${colors.base.white};
  padding: 4px 10px;
  // Glass 효과는 이후 적용 예정
`;

export const DdayText = styled.h1`
 color: ${colors.gray[800]};
 font-size: 10px;
 font-weight: 600;
`;
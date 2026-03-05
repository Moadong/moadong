import styled from 'styled-components';
import { colors } from '@/styles/theme/colors';

export const Container = styled.section`
  padding: 24px 18px 60px 18px;
`;

export const Title = styled.h3`
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 12px;
`;

export const Card = styled.div`
  background: ${colors.base.white};
  border-radius: 14px;
  padding: 16px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
`;

export const CardTitle = styled.div`
  font-weight: 700;
  margin-bottom: 6px;
`;

export const CardDesc = styled.div`
  font-size: 14px;
  color: ${colors.gray[600]};
`;
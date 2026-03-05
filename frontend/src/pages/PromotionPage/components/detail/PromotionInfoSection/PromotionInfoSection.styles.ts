import styled from 'styled-components';
import { colors } from '@/styles/theme/colors';

export const Container = styled.section`
  padding: 20px 18px;
`;

export const SectionTitle = styled.h3`
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 12px;
`;

export const Card = styled.div`
  background: ${colors.gray[100]};
  border-radius: 14px;
  padding: 16px;
`;

export const Item = styled.div`
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const Label = styled.div`
  font-weight: 600;
  margin-bottom: 6px;
`;

export const Value = styled.div`
  font-size: 14px;
  color: ${colors.gray[800]};
  line-height: 1.6;
`;
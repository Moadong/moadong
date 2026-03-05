import styled from 'styled-components';
import { colors } from '@/styles/theme/colors';

export const Container = styled.section`
  padding: 24px 20px;
`;

export const SectionTitle = styled.h3`
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 4px;
  color: ${colors.gray[800]};
`;

export const Card = styled.div`
  background: ${colors.gray[100]};
  border-radius: 14px;
  padding: 16px;
`;

export const Item = styled.div`
  margin-bottom: 22px;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const Label = styled.div`
  font-size: 14px;
  font-weight: 400;
  color: ${colors.gray[800]};
`;

export const Value = styled.div`
  font-size: 14px;
  font-weight: 400;
  color: ${colors.gray[800]};
`;

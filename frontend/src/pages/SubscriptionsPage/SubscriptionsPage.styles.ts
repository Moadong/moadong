import styled from 'styled-components';
import { theme } from '@/styles/theme';

export const Container = styled.div`
  padding: 16px;
`;

export const Title = styled.h1`
  font-size: 20px;
  font-weight: 700;
  color: ${theme.colors.gray[900]};
  padding: 8px 4px 16px;
`;

export const CardList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const Empty = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 60px 20px;
  text-align: center;
  color: ${theme.colors.gray[600]};
  font-size: 14px;
  line-height: 1.5;
`;

export const CtaButton = styled.button`
  margin-top: 4px;
  padding: 10px 20px;
  border: none;
  border-radius: 100px;
  background-color: ${theme.colors.primary[900]};
  color: #ffffff;
  font-weight: 600;
  cursor: pointer;
`;

import styled from 'styled-components';
import { colors } from '@/styles/theme/colors';

export const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding-bottom: 8px;
`;

export const MonthLabel = styled.h4`
  margin: 0;
  font-size: 1.05rem;
  font-weight: 700;
  color: ${colors.gray[900]};
`;

export const ErrorText = styled.p`
  margin: 0;
  font-size: 0.85rem;
  color: #dc2626;
`;

export const SaveButton = styled.button`
  margin-top: 18px;
  width: 100%;
  height: 52px;
  border: none;
  border-radius: 14px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  background: ${colors.primary[900]};
  color: ${colors.base.white};
  transition: background 0.15s;

  &:disabled {
    background: ${colors.gray[300]};
    color: ${colors.gray[600]};
    cursor: not-allowed;
  }
`;

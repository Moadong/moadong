import styled from 'styled-components';
import { colors } from '@/styles/theme/colors';

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

export const Tab = styled.button<{ $active: boolean }>`
  flex: 1;
  height: 32px;
  border: none;
  border-radius: 16px;
  font-size: 0.88rem;
  cursor: pointer;
  background: ${({ $active }) => ($active ? colors.base.white : 'transparent')};
  color: ${({ $active }) => ($active ? colors.gray[900] : colors.gray[600])};
  font-weight: ${({ $active }) => ($active ? 700 : 400)};
  box-shadow: ${({ $active }) =>
    $active ? '0 2px 8px rgba(0, 0, 0, 0.12)' : 'none'};
  transition:
    background 0.15s,
    color 0.15s;
`;

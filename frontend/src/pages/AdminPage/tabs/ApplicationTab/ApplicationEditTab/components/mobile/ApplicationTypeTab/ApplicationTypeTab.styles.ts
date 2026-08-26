import styled from 'styled-components';
import { colors } from '@/styles/theme/colors';

export const TabContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 4px;
  width: 335px;
  height: 52px;
  background: ${colors.gray[100]};
  border: 1px solid ${colors.gray[300]};
  border-radius: 14px;
  box-sizing: border-box;
`;

export const Tab = styled.button<{ $active: boolean }>`
  flex: 1;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 12px 10px;
  gap: 10px;
  height: 44px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-family: 'Pretendard', sans-serif;
  font-weight: 600;
  font-size: 14px;
  line-height: 140%;
  letter-spacing: -0.02em;
  color: ${colors.gray[700]};
  background: ${({ $active }) => ($active ? colors.base.white : 'transparent')};
  box-shadow: ${({ $active }) =>
    $active ? '0px 0px 8px rgba(0, 0, 0, 0.1)' : 'none'};
  transition:
    background 0.15s,
    box-shadow 0.15s;
`;

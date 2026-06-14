import styled from 'styled-components';
import { theme } from '@/styles/theme';

export const SubscribeButton = styled.button<{ $subscribed: boolean }>`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  background: none;
  cursor: pointer;
  color: ${({ $subscribed }) =>
    $subscribed ? theme.colors.primary[900] : theme.colors.gray[500]};
  padding: 4px;
  margin-left: 8px;
  border-radius: 50%;
  transition: color 0.2s ease;

  &:active {
    transform: scale(0.88);
    transition: transform 0.1s ease;
  }
`;

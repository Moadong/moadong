import styled, { keyframes } from 'styled-components';
import { colors } from '@/styles/theme/colors';

/** 디자인의 6프레임 시퀀스를 점마다 시차를 둔 바운스로 재현한다 */
const bounce = keyframes`
  0%, 60%, 100% { transform: translateY(0); }
  30% { transform: translateY(-2px); }
`;

export const Dots = styled.span`
  display: flex;
  align-items: center;
  gap: 2px;
  width: 10px;
  height: 2px;
`;

export const Dot = styled.span<{ $order: number }>`
  width: 2px;
  height: 2px;
  border-radius: 50%;
  background: ${colors.base.white};
  animation: ${bounce} 0.9s ease-in-out infinite;
  animation-delay: ${({ $order }) => $order * 0.15}s;
`;

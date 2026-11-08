// 앱 출시 장면의 배치, 모아동 앱 아이콘, 폭죽 조각, 스토어 배지 스타일
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { colors } from '@/styles/theme/colors';

export const Scene = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 36px;
`;

export const IconArea = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

/* 폭죽 조각은 아이콘 한가운데에서 출발해 둘레로 퍼진다 */
export const Piece = styled(motion.span)<{ $round: boolean }>`
  position: absolute;
  top: 50%;
  left: 50%;
  width: ${({ $round }) => ($round ? 10 : 8)}px;
  height: ${({ $round }) => ($round ? 10 : 16)}px;
  margin: -6px 0 0 -5px;
  border-radius: ${({ $round }) => ($round ? '50%' : '2px')};
`;

/* 실제 앱 아이콘처럼 주황 바탕에 흰 모아동 로고 */
export const AppIcon = styled(motion.div)`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 112px;
  height: 112px;
  border-radius: 26px;
  background: ${colors.primary[900]};
  box-shadow: 0 16px 36px rgba(255, 84, 20, 0.32);

  img {
    width: 64px;
    height: 64px;
    filter: brightness(0) invert(1);
  }
`;

export const Badge = styled.img`
  display: block;
  height: 48px;
  width: auto;
`;

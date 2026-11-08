// 앱 출시 장면의 배치, 흩어진 종이 조각, 모아동 앱 아이콘, 스토어 이름 스타일
import styled from 'styled-components';
import { colors } from '@/styles/theme/colors';

export const Scene = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24px;
`;

const PIECE_SIZE = {
  rect: { width: 10, height: 10, radius: '2px' },
  circle: { width: 9, height: 9, radius: '50%' },
  ribbon: { width: 6, height: 18, radius: '3px' },
} as const;

/* 막 터진 뒤 판 위에 흩어져 있는 종이 조각 */
export const Piece = styled.span<{ $shape: keyof typeof PIECE_SIZE }>`
  position: absolute;
  width: ${({ $shape }) => PIECE_SIZE[$shape].width}px;
  height: ${({ $shape }) => PIECE_SIZE[$shape].height}px;
  border-radius: ${({ $shape }) => PIECE_SIZE[$shape].radius};
  opacity: 0.85;
`;

/* 실제 앱 아이콘처럼 주황 바탕에 흰 모아동 로고 */
export const AppIcon = styled.div`
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

/* 누르는 버튼이 아니라 어느 스토어인지 알려 주는 표시 */
export const StoreName = styled.p`
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 20px;
  font-weight: 700;
  color: ${colors.gray[900]};

  img {
    width: 28px;
    height: 28px;
  }
`;

import styled from 'styled-components';
import { colors } from '@/styles/theme/colors';

/** 스와이프로 열리는 삭제 영역 너비 (스와이프 계산에도 사용) */
export const DELETE_WIDTH = 44;

export const Container = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: 12px;
`;

export const DeleteAction = styled.button`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: ${DELETE_WIDTH}px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 0;

  svg {
    width: 20px;
    height: 20px;
  }

  /* 아이콘 원본이 회색이라 브랜드 색으로 덮는다 (외곽선 stroke까지) */
  svg path {
    fill: ${colors.primary[800]};
    stroke: ${colors.primary[800]};
  }
`;

export const Content = styled.div<{ $offset: number; $animate: boolean }>`
  position: relative;
  background: ${colors.base.white};
  transform: translateX(${({ $offset }) => -$offset}px);
  transition: ${({ $animate }) => ($animate ? 'transform 0.2s ease' : 'none')};
  touch-action: pan-y;
`;

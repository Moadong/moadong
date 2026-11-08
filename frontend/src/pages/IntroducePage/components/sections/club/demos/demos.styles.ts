// 커서 데모 공통: 커서 기준 영역, 데스크탑 화면 축소, 일괄 변경 줄, AI 생성 중 덮개 스타일
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { media } from '@/styles/mediaQuery';
import { colors } from '@/styles/theme/colors';

/* 커서 좌표의 기준이 되는 영역 */
export const DemoRoot = styled.div`
  position: relative;
`;

export const Stack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const Toolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const SelectedCount = styled.span<{ $visible: boolean }>`
  font-size: 13px;
  font-weight: 600;
  color: ${colors.primary[900]};
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transition: opacity 0.2s ease;
`;

/* 지원서 편집 화면은 데스크탑 레이아웃이라 데스크탑 크기로 그린 뒤 줄여 보여준다 */
export const DesktopCanvas = styled.div`
  position: relative;
  width: 560px;
  min-height: 520px;
  zoom: 0.68;

  ${media.tablet} {
    zoom: 0.46;
  }
`;

export const Questions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 16px;
`;

/* 실제 화면의 전체 덮개 대신, 편집 영역 위에만 생성 중 표시를 띄운다 */
export const Generating = styled(motion.div)`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.5);
`;

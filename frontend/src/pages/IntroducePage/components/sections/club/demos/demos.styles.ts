// 커서 데모 공통: 커서 기준 영역, 데스크탑 화면 축소, 일괄 변경 줄, AI 초안 시작·생성 중·결과 스타일
import { motion } from 'framer-motion';
import styled, { keyframes } from 'styled-components';
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

export const DraftResult = styled(motion.div)`
  position: relative;
  overflow: hidden;
  border-radius: 12px;
`;

/* 생성이 끝나는 순간 결과 위를 한 번 훑는 무지갯빛 */
export const Sweep = styled(motion.span)`
  position: absolute;
  inset: 0 0 auto;
  height: 40%;
  background: linear-gradient(
    180deg,
    transparent,
    rgba(195, 121, 246, 0.18),
    rgba(255, 125, 164, 0.22),
    transparent
  );
  pointer-events: none;
`;

export const Thinking = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 24px;
`;

const shimmer = keyframes`
  from { background-position: 200% 0; }
  to { background-position: -200% 0; }
`;

/* 질문 칸 자리에 흐르는 무지갯빛 반짝임 */
export const Skeleton = styled.div<{ $height: number }>`
  height: ${({ $height }) => $height}px;
  border-radius: 12px;
  background: linear-gradient(
    100deg,
    ${colors.gray[100]} 20%,
    ${colors.primary[500]} 35%,
    ${colors.secondary[6].back} 45%,
    ${colors.secondary[4].back} 55%,
    ${colors.gray[100]} 70%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 1.6s linear infinite;
`;

/* AI 초안 생성 전 화면: 실제 편집 화면 대신 무엇을 누르면 되는지만 크게 보여 준다 */
export const DraftStart = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 354px;
  padding: 32px 24px;
  border-radius: 20px;
  background: ${colors.base.white};
  box-shadow: 0 0 0 1px ${colors.gray[300]};
  text-align: center;

  ${media.tablet} {
    min-height: 240px;
  }
`;

export const DraftStartTitle = styled.p`
  margin-top: 18px;
  font-size: 21px;
  font-weight: 700;
  color: ${colors.gray[950]};
  word-break: keep-all;

  ${media.mobile} {
    font-size: 18px;
  }
`;

export const RealButtonScale = styled.div`
  margin-top: 22px;
  zoom: 1.4;
`;

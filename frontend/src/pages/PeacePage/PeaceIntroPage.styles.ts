import styled from 'styled-components';
import { setTypography } from '@/styles/theme/typography';
import { PEACE_GREEN } from './constants/peaceColors';

/**
 * 화면 전체를 연한 초록으로 채운다. 음수 z-index는 부모(흰 배경) 밑으로 들어가 안 보이므로
 * 0에 두고 본문을 1로 올린다. 헤더는 자체 z-index가 더 높다.
 */
export const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background: linear-gradient(
    180deg,
    ${PEACE_GREEN.soft} 0%,
    ${({ theme }) => theme.colors.base.white} 100%
  );
`;

export const Hero = styled.section`
  position: relative;
  z-index: 1;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 16px;
`;

export const Dove = styled.img`
  width: 96px;
  height: 96px;
  margin-bottom: 8px;
  filter: drop-shadow(0 12px 24px rgba(47, 158, 107, 0.25));
`;

export const Eyebrow = styled.p`
  ${({ theme }) => setTypography(theme.typography.paragraph.p2)};
  color: ${PEACE_GREEN.main};
`;

export const Title = styled.h1`
  ${({ theme }) => setTypography(theme.typography.title.title2)};
  color: ${({ theme }) => theme.colors.base.black};
`;

export const Description = styled.p`
  ${({ theme }) => setTypography(theme.typography.paragraph.p1)};
  color: ${({ theme }) => theme.colors.gray[700]};
  white-space: pre-line;
`;

export const StartButton = styled.button`
  position: relative;
  z-index: 1;
  width: 100%;
  min-height: 64px;
  margin-top: auto;
  border: none;
  border-radius: 16px;
  background: ${PEACE_GREEN.main};
  color: ${({ theme }) => theme.colors.base.white};
  ${({ theme }) => setTypography(theme.typography.title.title5)};
  cursor: pointer;

  &:active {
    transform: scale(0.98);
  }
`;

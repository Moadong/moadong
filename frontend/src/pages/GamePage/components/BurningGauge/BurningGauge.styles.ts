import styled, { keyframes } from 'styled-components';

const flicker = keyframes`
  0%, 100% { opacity: 1; transform: scale(1); }
  50%      { opacity: 0.85; transform: scale(1.04); }
`;

export const Wrapper = styled.div`
  position: relative;
  width: 280px;
  max-width: 80vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
`;

export const Track = styled.div<{ $dark: boolean; $burning: boolean }>`
  position: relative;
  width: 100%;
  height: 14px;
  border-radius: 999px;
  overflow: hidden;
  background: ${({ $dark, theme }) =>
    $dark ? '#2A2A33' : theme.colors.gray[200]};
  box-shadow: ${({ $burning }) =>
    $burning ? '0 0 16px rgba(255, 84, 20, 0.7)' : 'none'};
  transition: box-shadow 0.2s;
`;

// width는 매 decay 틱(20fps)마다 바뀌므로 CSS 템플릿이 아닌 inline style로 넘긴다.
// 템플릿에 넣으면 값마다 새 클래스가 stylesheet에 주입돼 CSSOM 재파싱으로 렉이 생긴다.
export const Fill = styled.div.attrs<{ $ratio: number }>(({ $ratio }) => ({
  style: { width: `${Math.min(100, Math.max(0, $ratio * 100))}%` },
}))<{ $ratio: number; $burning: boolean }>`
  height: 100%;
  border-radius: 999px;
  background: ${({ $burning }) =>
    $burning
      ? 'linear-gradient(90deg, #FFD432, #FF5414)'
      : 'linear-gradient(90deg, #FF9D7C, #FF5414)'};
  transition: width 0.08s linear;
`;

export const Label = styled.span<{ $dark: boolean }>`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${({ $dark, theme }) =>
    $dark ? theme.colors.gray[400] : theme.colors.gray[600]};
`;

export const BurningBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.95rem;
  font-weight: 800;
  color: #ff5414;
  animation: ${flicker} 0.6s ease-in-out infinite;
`;

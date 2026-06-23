import styled from 'styled-components';
import { media } from '@/styles/mediaQuery';

export const PageContainer = styled.div<{ $dark: boolean }>`
  position: relative;
  overflow-x: clip;
  min-height: 100vh;
  background: ${({ $dark, theme }) =>
    $dark ? '#111111' : theme.colors.gray[100]};
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 48px 20px 80px;
  transition: background 0.3s;

  ${media.mobile} {
    padding: 32px 16px 60px;
  }
`;

export const ToggleBar = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
  margin-bottom: 12px;
`;

export const ToggleSwitch = styled.button<{ $dark: boolean }>`
  position: relative;
  width: 60px;
  height: 32px;
  flex-shrink: 0;
  padding: 0;
  border-radius: 999px;
  border: 1px solid
    ${({ $dark, theme }) => ($dark ? '#3A3A4A' : theme.colors.gray[300])};
  background: ${({ $dark, theme }) =>
    $dark ? '#262633' : theme.colors.gray[200]};
  cursor: pointer;
  transition:
    background 0.25s,
    border-color 0.25s;
`;

export const ToggleKnob = styled.span<{ $dark: boolean }>`
  position: absolute;
  top: 3px;
  left: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${({ $dark }) => ($dark ? '#111111' : '#FFFFFF')};
  color: ${({ $dark }) => ($dark ? '#FFD432' : '#FF9500')};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);
  transform: translateX(${({ $dark }) => ($dark ? '28px' : '0')});
  transition:
    transform 0.25s ease,
    background 0.25s,
    color 0.25s;
`;

export const Content = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 1400px;
`;

export const PageTitle = styled.h1<{ $dark: boolean }>`
  font-size: 1.75rem;
  font-weight: 800;
  color: ${({ $dark, theme }) => ($dark ? '#FFFFFF' : theme.colors.gray[900])};
  margin-bottom: 4px;

  ${media.mobile} {
    font-size: 1.4rem;
  }
`;

export const PageDescription = styled.p<{ $dark: boolean }>`
  font-size: 0.95rem;
  color: ${({ $dark, theme }) =>
    $dark ? theme.colors.gray[500] : theme.colors.gray[600]};
  margin-top: 4px;
`;

export const DesktopOnly = styled.div`
  position: absolute;
  right: 0;
  top: 0;

  ${media.laptop} {
    display: none;
  }
`;

export const MobileOnly = styled.div`
  display: none;
  width: 100%;
  margin-top: 64px;

  ${media.laptop} {
    display: block;
  }
`;

export const PlayArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  /* 게이지를 버튼 위에 배치. ClickButton의 음수 마진(-100px)을 일부 상쇄해
     게이지가 버튼 상단 빈 영역 위에 자연스럽게 놓이도록 한다. */
  & > *:first-child {
    position: relative;
    z-index: 3;
    margin-bottom: 40px;
  }
`;

export const TopRow = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  width: 100%;
  margin-bottom: 16px;

  & > *:first-child {
    text-align: center;
  }

  ${media.tablet} {
    margin-bottom: 32px;
  }
`;

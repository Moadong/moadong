import styled from 'styled-components';
import { media } from '@/styles/mediaQuery';
import { theme } from '@/styles/theme';
import { Z_INDEX } from '@/styles/zIndex';

export const Nav = styled.nav`
  display: none;

  ${media.tablet} {
    display: block;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #ffffff;
    border-top: 1px solid #f0f0f0;
    padding-bottom: env(safe-area-inset-bottom);
    z-index: ${Z_INDEX.bottomNav};
    /* iOS/안드로이드 fixed-bottom 글리치 방지: 레이어 승격으로 visual viewport 추적 */
    transform: translateZ(0);
    will-change: transform;
  }
`;

export const Inner = styled.div`
  display: flex;
  max-width: 500px;
  margin: 0 auto;
  padding: 6px 0;
`;

export const Tab = styled.button<{ $active: boolean }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  border: none;
  background: none;
  padding: 0;
  cursor: pointer;
  color: ${({ $active }) =>
    $active ? theme.colors.primary[900] : theme.colors.gray[500]};
`;

export const ImageIcon = styled.img`
  width: 28px;
  height: 28px;
  object-fit: contain;
`;

export const Label = styled.span`
  font-size: 10px;
  font-weight: 500;
  line-height: 1;
  color: inherit;
`;

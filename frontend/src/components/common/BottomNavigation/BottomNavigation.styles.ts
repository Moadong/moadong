import styled from 'styled-components';
import { media } from '@/styles/mediaQuery;
import { theme } from '@/styles/theme';
import { Z_INDEX } from '@/styles/zIndex';

export const Nav = styled.nav<{ $isHome?: boolean }>`
  display: none;

  ${media.tablet} {
    display: block;
    position: fixed;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    max-width: 500px;
    background-color: #ffffff;
    border-top: 1px solid #f0f0f0;
    padding-bottom: env(safe-area-inset-bottom);
    z-index: ${Z_INDEX.bottomNav};

    ${({ $isHome }) =>
      $isHome &&
      `
      left: 0;
      transform: none;
      max-width: 100%;
    `}
  }

  ${media.mobile} {
    left: 0;
    transform: none;
    max-width: 100%;
  }
`;

export const Inner = styled.div`
  display: flex;
  max-width: 500px;
  margin: 0 auto;
  padding: 10px 0 16px;
`;

export const Tab = styled.button<{ $active: boolean }>`
  position: relative;
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

export const NotificationDot = styled.span`
  position: absolute;
  top: 0;
  left: calc(50% + 8px);
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${theme.colors.primary[900]};
`;

export const Label = styled.span`
  font-size: 10px;
  font-weight: 500;
  line-height: 1;
  color: inherit;
`;

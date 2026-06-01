import styled from 'styled-components';

export const WEBVIEW_BOTTOM_NAV_HEIGHT = 56;

export const BottomNavContainer = styled.nav`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  height: calc(${WEBVIEW_BOTTOM_NAV_HEIGHT}px + env(safe-area-inset-bottom));
  padding-bottom: env(safe-area-inset-bottom);
  display: flex;
  background-color: ${({ theme }) => theme.colors.base.white};
  border-top: 1px solid ${({ theme }) => theme.colors.gray[300]};
  z-index: 100;
`;

export const NavButton = styled.button<{ $isActive: boolean }>`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 12px;
  font-weight: ${({ $isActive }) => ($isActive ? 600 : 400)};
  color: ${({ theme, $isActive }) =>
    $isActive ? theme.colors.primary[900] : theme.colors.gray[600]};
`;

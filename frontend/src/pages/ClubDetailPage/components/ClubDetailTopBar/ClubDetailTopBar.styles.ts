import styled from 'styled-components';

export const TopBarWrapper = styled.div<{ $isVisible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background-color: ${({ $isVisible, theme }) =>
    $isVisible ? theme.colors.base.white : 'transparent'};
  box-shadow: ${({ $isVisible }) =>
    $isVisible ? '0 4px 6px -1px rgba(0, 0, 0, 0.05)' : 'none'};
  transition: all 0.2s ease;
  padding-top: var(--rn-safe-top, 0px);
`;

export const TopBarContent = styled.header<{ $isVisible: boolean }>`
  position: relative;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
`;

export const IconButtonWrapper = styled.div`
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const IconButton = styled.button<{ $isVisible: boolean }>`
  width: 36px;
  height: 36px;
  padding: 0;
  border: none;
  background-color: ${({ $isVisible, theme }) =>
    $isVisible ? 'transparent' : theme.colors.base.white};
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease;
`;

export const NotificationButton = styled.button<{
  $isVisible: boolean;
  $isActive: boolean;
}>`
  width: 36px;
  height: 36px;
  padding: 0;
  border: none;
  background-color: ${({ $isVisible, theme }) =>
    $isVisible ? 'transparent' : theme.colors.base.white};
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease;

  svg {
    transition: all 0.2s ease;
  }
`;

export const ClubName = styled.h1<{ $isVisible: boolean }>`
  font-size: 22px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.base.black};
  text-align: center;
  flex: 1;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 0 12px;
  opacity: ${({ $isVisible }) => ($isVisible ? 1 : 0)};
  transition: opacity 0.2s ease;
`;

export const Placeholder = styled.div`
  width: 36px;
  height: 36px;
`;

export const TabBar = styled.div`
  display: flex;
  width: 100%;
  padding: 0 20px;
  background-color: ${({ theme }) => theme.colors.base.white};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
`;

export const TabButton = styled.button<{ $active: boolean }>`
  flex: 1;
  font-size: 14px;
  font-weight: 700;
  padding: 4px 0;
  color: ${({ $active, theme }) =>
    $active ? theme.colors.gray[800] : theme.colors.gray[400]};
  background: none;
  border: none;
  border-bottom: 2px solid
    ${({ $active, theme }) =>
      $active ? theme.colors.gray[800] : 'transparent'};
  cursor: pointer;
  transition: all 0.2s ease;
`;

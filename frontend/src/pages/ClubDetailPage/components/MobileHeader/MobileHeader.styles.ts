import styled from 'styled-components';

export const HeaderWrapper = styled.div<{ $isVisible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background-color: ${({ $isVisible, theme }) =>
    $isVisible ? theme.colors.base.white : 'transparent'};
  transition: background-color 0.2s ease;
`;

export const Header = styled.header<{ $isVisible: boolean }>`
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
  background-color: ${({ $isVisible }) =>
    $isVisible ? 'transparent' : 'rgba(255, 255, 255, 0.8)'};
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease;

  img {
    width: 28px;
    height: 28px;
  }
`;

export const NotificationButton = styled.button<{
  $isVisible: boolean;
  $isActive: boolean;
}>`
  width: 36px;
  height: 36px;
  padding: 0;
  border: none;
  background-color: ${({ $isVisible, $isActive, theme }) => {
    if ($isActive) return theme.colors.primary[900];
    return $isVisible ? 'transparent' : 'rgba(255, 255, 255, 0.8)';
  }};
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

export const Title = styled.h1<{ $isVisible: boolean }>`
  font-size: 18px;
  font-weight: 600;
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
  height: 26px;
  background-color: ${({ theme }) => theme.colors.base.white};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
`;

export const TabButton = styled.button<{ $active: boolean }>`
  flex: 1;
  font-size: 14px;
  font-weight: 700;
  padding: 0;
  height: 100%;
  color: ${({ $active, theme }) => ($active ? theme.colors.gray[800] : theme.colors.gray[400])};
  background: none;
  border: none;
  border-bottom: 2px solid ${({ $active, theme }) => ($active ? theme.colors.gray[800] : 'transparent')};
  cursor: pointer;
  transition: all 0.2s ease;
`;

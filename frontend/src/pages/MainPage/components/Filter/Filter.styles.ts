import styled from 'styled-components';
import Button from '@/components/common/Button/Button';
import { theme } from '@/styles/theme';

export const FilterListContainer = styled.div`
  margin-top: 56px;
  display: flex;
  flex-direction: row;
  padding: 10px 20px;
  gap: 7px;
`;

export const FilterButton = styled(Button)<{ $isActive?: boolean }>`
  border-radius: 100px;
  height: 32px;
  padding: 6px 12px;
  border-radius: 100px;
  font-size: ${theme.typography.button.button1.size};
  font-weight: ${theme.typography.button.button1.weight};
  color: ${({ $isActive }) =>
    $isActive ? theme.colors.gray[200] : theme.colors.gray[800]};
  background-color: ${({ $isActive }) =>
    $isActive ? theme.colors.gray[800] : theme.colors.gray[200]};

  &:hover {
    background-color: ${({ $isActive }) =>
      $isActive ? theme.colors.gray[800] : theme.colors.gray[200]};
  }
`;

export const NotificationDot = styled.span<{ $isVisible?: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${theme.colors.primary[900]};
  display: ${({ $isVisible }) => ($isVisible ? 'inline-block' : 'none')};
  position: absolute;
  top: 1px;
  left: 3px;
`;

export const FilterButtonWrapper = styled.div`
  position: relative;
  display: inline-flex;
`;

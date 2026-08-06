import styled from 'styled-components';
import MoreArrowIcon from '@/assets/images/icons/more_arraw_icon.svg?react';
import { colors } from '@/styles/theme/colors';
import { setTypography, typography } from '@/styles/theme/typography';

export const Wrapper = styled.div`
  position: relative;
  width: 100%;
`;

export const Trigger = styled.button<{ $isOpen: boolean }>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 14px 18px;
  width: 100%;
  height: 52px;
  border-radius: 14px;
  border: 1px solid
    ${({ $isOpen }) => ($isOpen ? colors.primary[800] : colors.gray[200])};
  background: ${({ $isOpen }) =>
    $isOpen ? colors.base.white : colors.gray[50]};
  cursor: pointer;
  box-sizing: border-box;
`;

export const TriggerLabel = styled.span`
  ${setTypography(typography.paragraph.p2)}
  color: ${colors.base.black};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
  text-align: left;
`;

export const ChevronIcon = styled(MoreArrowIcon)`
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  color: ${colors.gray[500]};
`;

export const MenuCard = styled.div<{ $isFixed: boolean; $hasScroll: boolean }>`
  position: absolute;
  top: calc(100% + 5px);
  left: 0;
  right: 0;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 6px;
  gap: ${({ $hasScroll }) => ($hasScroll ? '4px' : '0')};
  height: ${({ $isFixed }) => ($isFixed ? '142px' : 'auto')};
  box-sizing: border-box;
  background: ${colors.base.white};
  border: 1px solid ${colors.gray[300]};
  box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  z-index: 10;
`;

export const MenuList = styled.div<{ $hasScroll: boolean }>`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
  max-height: ${({ $hasScroll }) => ($hasScroll ? '130px' : 'none')};
  overflow-y: ${({ $hasScroll }) => ($hasScroll ? 'auto' : 'visible')};

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const MenuItem = styled.div<{ $isSelected: boolean }>`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 10px 0;
  height: 42px;
  flex-shrink: 0;
  border-radius: ${({ $isSelected }) => ($isSelected ? '6px' : '8px')};
  background: ${({ $isSelected }) =>
    $isSelected ? colors.gray[100] : 'transparent'};
  ${setTypography(typography.paragraph.p2)}
  color: ${({ $isSelected }) =>
    $isSelected ? colors.base.black : colors.gray[600]};
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const ScrollbarTrack = styled.div`
  width: 6px;
  height: 130px;
  flex-shrink: 0;
  position: relative;
`;

export const ScrollbarThumb = styled.div<{ $offset: number }>`
  position: absolute;
  top: ${({ $offset }) => $offset}px;
  width: 6px;
  height: 60px;
  background: ${colors.gray[300]};
  border-radius: 1000px;
`;

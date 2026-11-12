import styled from 'styled-components';
import MoreArrowIcon from '@/assets/images/icons/more_arraw_icon.svg?react';
import { colors } from '@/styles/theme/colors';
import { setTypography, typography } from '@/styles/theme/typography';

export const Wrapper = styled.div`
  position: relative;
  width: 100%;
  z-index: 6;
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
  box-shadow: inset 0 0 0 1px
    ${({ $isOpen }) => ($isOpen ? colors.primary[800] : colors.gray[200])};
  border: none;
  background: ${({ $isOpen }) =>
    $isOpen ? colors.base.white : colors.gray[50]};
  cursor: pointer;
  box-sizing: border-box;

  &:disabled {
    cursor: default;
    opacity: 0.5;
  }

  /* 강제 색상(고대비) 모드는 box-shadow를 지우므로 그 모드에서만 테두리를 그린다.
     평소 outline을 건드리지 않아 키보드 포커스 링은 그대로 남는다 */
  @media (forced-colors: active) {
    border: 1px solid;
  }
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

export const ChevronIcon = styled(MoreArrowIcon)<{ $isOpen: boolean }>`
  flex-shrink: 0;
  width: 12px;
  height: 6px;
  margin: 9px 6px;
  color: ${colors.gray[500]};

  /* 선 굵기 1.8의 둥근 끝이 높이 6px viewBox 밖으로 나가 잘리지 않게 한다 */
  overflow: visible;

  path {
    stroke-width: 1.8;
  }
  transform: ${({ $isOpen }) => ($isOpen ? 'rotate(180deg)' : 'rotate(0deg)')};
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

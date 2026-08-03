import styled from 'styled-components';
import NextApplicant from '@/assets/images/icons/next_applicant.svg?react';
import MoreArrowIcon from '@/assets/images/icons/more_arraw_icon.svg?react';
import PrevApplicant from '@/assets/images/icons/prev_applicant.svg?react';
import { colors } from '@/styles/theme/colors';
import { setTypography, typography } from '@/styles/theme/typography';

export const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 14px 18px;
  gap: 5px;
  width: 100%;
  height: 52px;
  background: ${colors.gray[50]};
  border: 1px solid ${colors.gray[200]};
  border-radius: 14px;
  box-sizing: border-box;
`;

export const NavButton = styled.button`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;

  &:disabled {
    cursor: default;
  }
`;

const navIconBase = `
  width: 24px;
  height: 24px;
  flex-shrink: 0;

  & circle {
    display: none;
  }
  & path {
    stroke: currentColor;
  }
`;

export const PrevIcon = styled(PrevApplicant)<{ $disabled: boolean }>`
  ${navIconBase}
  color: ${({ $disabled }) => ($disabled ? colors.gray[500] : colors.gray[800])};
`;

export const NextIcon = styled(NextApplicant)<{ $disabled: boolean }>`
  ${navIconBase}
  color: ${({ $disabled }) => ($disabled ? colors.gray[500] : colors.gray[800])};
`;

export const Center = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 5px;
  cursor: pointer;
`;

export const ApplicantName = styled.span`
  ${setTypography(typography.paragraph.p2)}
  color: ${colors.gray[900]};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 160px;
`;

export const ChevronIcon = styled(MoreArrowIcon)<{ $isOpen: boolean }>`
  flex-shrink: 0;
  width: 11px;
  height: 6px;
  color: ${colors.primary[800]};
  transform: ${({ $isOpen }) => ($isOpen ? 'rotate(180deg)' : 'rotate(0deg)')};
  transition: transform 0.15s ease;
`;

export const Dropdown = styled.div<{ $hasScroll: boolean }>`
  position: absolute;
  top: calc(100% + 4px);
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: ${({ $hasScroll }) => ($hasScroll ? '4px' : '0')};
  padding: 6px;
  background: ${colors.base.white};
  border: 1px solid ${colors.gray[300]};
  box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  z-index: 10;
  min-width: 102px;
`;

export const DropdownList = styled.div<{
  $hasScroll: boolean;
  $maxHeight: number;
}>`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
  max-height: ${({ $hasScroll, $maxHeight }) =>
    $hasScroll ? `${$maxHeight}px` : 'none'};
  overflow-y: ${({ $hasScroll }) => ($hasScroll ? 'auto' : 'visible')};

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const DropdownItem = styled.div<{ $isSelected: boolean }>`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 10px 0;
  height: 40px;
  flex-shrink: 0;
  border-radius: ${({ $isSelected }) => ($isSelected ? '6px' : '8px')};
  background: ${({ $isSelected }) =>
    $isSelected ? colors.gray[100] : 'transparent'};
  ${setTypography(typography.button.button1)}
  color: ${({ $isSelected }) =>
    $isSelected ? colors.base.black : colors.gray[600]};
  cursor: pointer;
  white-space: nowrap;
  padding-left: 8px;
  padding-right: 8px;

  &:active {
    background: ${colors.gray[100]};
  }
`;

export const ScrollbarTrack = styled.div<{ $height: number }>`
  width: 6px;
  height: ${({ $height }) => $height}px;
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

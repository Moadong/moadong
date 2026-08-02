import styled from 'styled-components';
import NextApplicant from '@/assets/images/icons/next_applicant.svg?react';
import PrevApplicant from '@/assets/images/icons/prev_applicant.svg?react';
import TriangleDown from '@/assets/images/icons/triangle_down.svg?react';
import { colors } from '@/styles/theme/colors';
import { setTypography, typography } from '@/styles/theme/typography';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  width: 100%;
`;

export const NavButton = styled.button`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;

  &:disabled {
    opacity: 0.3;
    cursor: default;
  }
`;

export const PrevIcon = styled(PrevApplicant)`
  width: 30px;
  height: 30px;
  flex-shrink: 0;
`;

export const NextIcon = styled(NextApplicant)`
  width: 30px;
  height: 30px;
  flex-shrink: 0;
`;

export const SelectorWrapper = styled.div`
  position: relative;
  flex: 1;
  min-width: 0;
`;

export const Trigger = styled.button<{ $isOpen: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  width: 100%;
  height: 44px;
  border-radius: 12px;
  border: 1px solid
    ${({ $isOpen }) => ($isOpen ? colors.primary[800] : colors.gray[300])};
  background: ${({ $isOpen }) =>
    $isOpen ? colors.base.white : colors.gray[50]};
  cursor: pointer;
  gap: 8px;
`;

export const ApplicantName = styled.span`
  ${setTypography(typography.paragraph.p2)}
  color: ${colors.base.black};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
  text-align: left;
`;

export const ChevronIcon = styled(TriangleDown)<{ $isOpen: boolean }>`
  flex-shrink: 0;
  width: 8px;
  height: 6px;
  color: ${colors.gray[600]};
  transform: ${({ $isOpen }) => ($isOpen ? 'rotate(180deg)' : 'rotate(0deg)')};
  transition: transform 0.15s ease;
`;

export const Dropdown = styled.div<{ $hasScroll: boolean }>`
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
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
`;

export const DropdownList = styled.div<{ $hasScroll: boolean }>`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
  max-height: ${({ $hasScroll }) => `${3 * 44}px`};
  overflow-y: ${({ $hasScroll }) => ($hasScroll ? 'auto' : 'visible')};

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const DropdownItem = styled.div<{ $isSelected: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: 44px;
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

  &:active {
    background: ${colors.gray[100]};
  }
`;

export const ScrollbarTrack = styled.div`
  width: 6px;
  height: ${3 * 44}px;
  flex-shrink: 0;
  position: relative;
`;

export const ScrollbarThumb = styled.div<{ $offset: number }>`
  position: absolute;
  top: ${({ $offset }) => $offset}px;
  width: 6px;
  height: 48px;
  background: ${colors.gray[300]};
  border-radius: 1000px;
`;

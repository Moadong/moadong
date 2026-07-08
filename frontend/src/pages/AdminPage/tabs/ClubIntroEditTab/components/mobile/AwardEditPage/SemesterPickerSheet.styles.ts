import styled, { keyframes } from 'styled-components';
import { colors } from '@/styles/theme/colors';
import { setTypography, typography } from '@/styles/theme/typography';

const slideUp = keyframes`
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
`;

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(17, 17, 17, 0.2);
  z-index: 100;
  display: flex;
  align-items: flex-end;
`;

export const Sheet = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 20px 20px 30px;
  gap: 6px;
  width: 100%;
  background: ${colors.base.white};
  border-radius: 20px 20px 0 0;
  animation: ${slideUp} 0.25s ease-out;
`;

export const SheetTitle = styled.span`
  display: block;
  width: 100%;
  ${setTypography(typography.paragraph.p5)}
  color: ${colors.gray[700]};
  text-align: center;
`;

export const PickerWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 150px;
  overflow: hidden;

  &::before,
  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    height: 35px;
    pointer-events: none;
    z-index: 1;
  }
  &::before {
    top: 0;
    background: linear-gradient(to bottom, ${colors.base.white}, transparent);
  }
  &::after {
    bottom: 0;
    background: linear-gradient(to top, ${colors.base.white}, transparent);
  }
`;

export const SelectedHighlight = styled.div`
  position: absolute;
  top: 49px;
  left: 0;
  right: 0;
  height: 52px;
  border-top: 2px solid ${colors.primary[700]};
  border-bottom: 2px solid ${colors.primary[700]};
  pointer-events: none;
  z-index: 2;
`;

export const ScrollContainer = styled.div`
  height: 150px;
  overflow-y: scroll;
  scroll-snap-type: y mandatory;

  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

export const ScrollSpacer = styled.div`
  height: 50px;
`;

export const PickerItem = styled.div<{
  $isSelected: boolean;
  $distance: number;
}>`
  padding: 14px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  scroll-snap-align: center;
  ${setTypography(typography.paragraph.p2)}
  color: ${({ $isSelected }) =>
    $isSelected ? colors.gray[800] : colors.gray[600]};
  transform: ${({ $distance }) =>
    `scale(${Math.max(0.88, 1 - $distance * 0.05)})`};
  transition:
    color 0.15s ease,
    transform 0.15s ease;
  cursor: pointer;
`;

export const ConfirmButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 14px 40px;
  width: 100%;
  height: 50px;
  background: ${colors.gray[900]};
  box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.1);
  border: none;
  border-radius: 10px;
  cursor: pointer;
  ${setTypography(typography.paragraph.p2)}
  color: ${colors.base.white};
`;

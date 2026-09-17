import styled from 'styled-components';
import { colors } from '@/styles/theme/colors';
import { setTypography, typography } from '@/styles/theme/typography';

export const Dialog = styled.div`
  background: ${colors.base.white};
  border-radius: 14px;
  border: 1px solid ${colors.gray[200]};
  overflow: hidden;
  max-height: calc(100dvh - 48px - env(safe-area-inset-bottom));
  display: flex;
  flex-direction: column;
  width: 280px;
  max-width: calc(100vw - 48px);
`;

export const Header = styled.div`
  padding: 16px 20px;
  border-bottom: 1px solid ${colors.gray[200]};
  display: flex;
  align-items: center;
`;

export const Title = styled.h3`
  ${setTypography(typography.title.title6)};
  color: ${colors.base.black};
  flex: 1;
  text-align: left;
`;

export const CloseButton = styled.button`
  border: none;
  background: transparent;
  ${setTypography(typography.paragraph.p4)};
  color: ${colors.gray[600]};
  line-height: 1;
  cursor: pointer;
`;

export const Body = styled.div`
  position: relative;
  padding: 16px 20px 20px;
`;

export const EmptyMessage = styled.div`
  padding: 16px 8px;
  color: ${colors.gray[600]};
  text-align: center;
  ${setTypography(typography.paragraph.p5)};
`;

export const ListWrapper = styled.div`
  max-height: 164px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const List = styled.div`
  display: grid;
  gap: 16px;
`;

export const OptionButton = styled.button`
  width: 100%;
  padding: 12px 16px;
  border-radius: 10px;
  border: 1px solid ${colors.gray[200]};
  background: ${colors.base.white};
  ${setTypography(typography.button.button1)};
  cursor: pointer;
  color: ${colors.base.black};
  transition:
    background-color 0.15s ease,
    color 0.15s ease,
    border-color 0.15s ease;

  &:hover {
    background: ${colors.primary[800]};
    color: ${colors.base.white};
    border-color: ${colors.primary[800]};
  }
`;

export const ScrollbarTrack = styled.div`
  position: absolute;
  right: 8px;
  top: 16px;
  width: 6px;
  height: 164px;
`;

export const ScrollbarThumb = styled.div<{ $offset: number }>`
  position: absolute;
  top: ${({ $offset }) => $offset}px;
  width: 6px;
  height: 60px;
  background: ${colors.gray[300]};
  border-radius: 1000px;
`;

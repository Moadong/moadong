import styled, { css } from 'styled-components';
import { colors } from '@/styles/theme/colors';

export const Panel = styled.div<{ $alignRight?: boolean }>`
  position: absolute;
  top: 55px;
  left: 0;
  background: ${colors.base.white};
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.18);
  overflow: hidden;
  z-index: 10;
  left: 0;
  right: auto;

  ${({ $alignRight }) =>
    $alignRight &&
    css`
      right: 0;
      left: auto;
    `}
`;

export const Header = styled.div`
  display: grid;
  grid-template-columns: 40px 1fr 40px 60px 60px;
  height: 44px;
  background: ${colors.primary[800]};
  color: white;
  align-items: center;
  text-align: center;
`;

export const NavButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
`;

export const Title = styled.div`
  font-weight: 600;
`;

export const TimeLabel = styled.div`
  font-weight: 600;
`;

export const Body = styled.div`
  display: grid;
  grid-template-columns: 1fr 120px;
`;

import styled from 'styled-components';
import { colors } from '@/styles/theme/colors';
import { Z_INDEX } from '@/styles/zIndex';

export const Button = styled.button<{ $bottom: string }>`
  position: fixed;
  bottom: ${({ $bottom }) => $bottom};
  right: 20px;
  width: 48px;
  height: 48px;
  border: none;
  border-radius: 50%;
  background-color: ${colors.primary[900]};
  box-shadow: 0px 0px 14px rgba(0, 0, 0, 0.16);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  z-index: ${Z_INDEX.floatingButton};

  &:hover {
    background-color: ${colors.primary[800]};
  }
`;

import styled from 'styled-components';
import { theme } from '@/styles/theme';
import { Z_INDEX } from '@/styles/zIndex';

export const Nav = styled.nav`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  background-color: #ffffff;
  border-top: 1px solid #f0f0f0;
  padding-top: 6px;
  padding-bottom: calc(6px + env(safe-area-inset-bottom));
  z-index: ${Z_INDEX.bottomNav};
`;

export const Tab = styled.button`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  border: none;
  background: none;
  padding: 0;
  cursor: pointer;
`;

export const MaskIcon = styled.span<{ $icon: string; $active: boolean }>`
  width: 28px;
  height: 28px;
  background-color: ${({ $active }) =>
    $active ? theme.colors.primary[900] : theme.colors.gray[500]};
  -webkit-mask: url(${({ $icon }) => $icon}) center / contain no-repeat;
  mask: url(${({ $icon }) => $icon}) center / contain no-repeat;
`;

export const ImageIcon = styled.img`
  width: 28px;
  height: 28px;
  object-fit: contain;
`;

export const Label = styled.span<{ $active: boolean }>`
  font-size: 10px;
  font-weight: 500;
  line-height: 1;
  color: ${({ $active }) =>
    $active ? theme.colors.primary[900] : theme.colors.gray[500]};
`;

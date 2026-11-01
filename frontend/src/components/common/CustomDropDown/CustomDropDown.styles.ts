import styled from 'styled-components';
import { colors } from '@/styles/theme/colors';

export const DropDownWrapper = styled.div`
  position: relative;
  width: 100%;
  cursor: pointer;
`;

export const OptionList = styled.ul<{
  $top?: string;
  $width?: string;
  $right?: string;
}>`
  position: absolute;
  top: ${({ $top }) => $top || '110%'};
  left: ${({ $right }) => ($right ? 'auto' : '0')};
  width: ${({ $width }) => $width || '100%'};
  right: ${({ $right }) => $right || 'auto'};
  border-radius: 6px;
  border: 1px solid ${colors.gray[400]};
  background: ${colors.base.white};
  box-shadow: 0 1px 8px 0 rgba(0, 0, 0, 0.12);
  padding: 6px 0;
  z-index: 10;
  height: auto;
  list-style: none;
`;

export const OptionItem = styled.li<{ $isSelected: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-weight: 600;
  color: ${colors.gray[700]};
  background-color: ${({ $isSelected }) =>
    $isSelected ? colors.gray[100] : colors.base.white};
  cursor: pointer;
  padding: 8px 13px;
  height: 27px;

  &:hover {
    background-color: ${colors.gray[100]};
  }

  transition: background-color 0.2s ease;
  user-select: none;
`;

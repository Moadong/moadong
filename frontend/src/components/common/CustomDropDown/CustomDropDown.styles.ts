import styled from 'styled-components';

export const DropDownWrapper = styled.div`
  position: relative;
  width: 100%;
`;

interface OptionListProps {
  top?: string;
  width?: string;
  right?: string;
}

export const OptionList = styled.ul<OptionListProps>`
  position: absolute;
  top: ${({ top }) => top || '100%'};
  left: ${({ right }) => (right ? 'auto' : '0')};
  width: ${({ width }) => width || '100%'};
  right: ${({ right }) => right || 'auto'};
  border-radius: 6px;
  border: 1px solid #dcdcdc;
  background: #fff;
  box-shadow: 0 1px 8px 0 rgba(0, 0, 0, 0.12);
  padding: 6px 0;
  z-index: 10;
  height: auto;
  list-style: none;
`;

export const OptionItem = styled.li<{ isSelected: boolean }>`
  text-align: center;
  padding: 10px;
  font-weight: 600;
  color: #787878;
  background-color: ${({ isSelected }) => (isSelected ? '#DCDCDC' : '#fff')};
  cursor: pointer;
  padding: 8px 13px;

  &:hover {
    background-color: #f5f5f5;
  }

  transition: background-color 0.2s ease;
  user-select: none;
`;

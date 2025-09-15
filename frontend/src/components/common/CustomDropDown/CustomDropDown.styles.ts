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
  background: #fff;
  border-radius: 6px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  z-index: 10;
  list-style: none;
`;

export const OptionItem = styled.li<{ isSelected: boolean }>`
  text-align: center;
  padding: 10px;
  margin: 4px;
  font-weight: 600;
  border-radius: 6px;
  color: #787878;
  background-color: ${({ isSelected }) => (isSelected ? '#DCDCDC' : '#fff')};
  cursor: pointer;

  &:hover {
    background-color: #dcdcdc;
  }

  transition: background-color 0.2s ease;
  user-select: none;
`;

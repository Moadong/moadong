import styled from 'styled-components';

export const DropDownWrapper = styled.div`
  position: relative;
  width: 100%;
`;

export const Selected = styled.div<{ open: boolean }>`
  padding: 12px 16px;
  border-radius: 0.375rem;
  background: ${({ open }) => (open ? '#fff' : '#f5f5f5')};
  color: #787878;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid ${({ open }) => (open ? '#c5c5c5' : 'transparent')};
  transition:
    border-color 0.2s ease,
    background-color 0.2s ease;

  user-select: none;
`;

export const OptionList = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
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

export const Icon = styled.img`
  position: absolute;
  top: 50%;
  right: 19px;
  transform: translateY(-50%);
  pointer-events: none;
`;

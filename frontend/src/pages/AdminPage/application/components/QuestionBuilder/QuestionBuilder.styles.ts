import styled from 'styled-components';

export const QuestionMenu = styled.div`
  display: flex;
  max-width: 140px;
  width: 100%;
  flex-direction: column;
  gap: 4px;
`;

export const QuestionFieldContainer = styled.div`
  width: 100%;
`;

export const RequiredToggleButton = styled.div`
  display: flex;
  border: none;
  padding: 12px 16px;
  justify-content: space-between;
  align-items: center;
  border-radius: 0.375rem;
  background: #f5f5f5;
  cursor: pointer;
  margin: 0;
  color: #787878;
  font-size: 0.875rem;
  font-weight: 600;
`;

export const RequiredToggleCircle = styled.span<{ active?: boolean }>`
  position: relative;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 1px solid ${(props) => (props.active ? '#ff5000' : '#ccc')};
  background-color: ${(props) => (props.active ? '#ff5000' : 'white')};

  ${({ active }) =>
    active &&
    `
    background-color: #fff;
    &::after {
      content: '';
      width: 10px;
      height: 10px;
      background-color: #ff5000;
      border-radius: 50%;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  `}
`;

export const DropDownWrapper = styled.div`
  position: relative;
  width: 100%;
`;

export const Dropdown = styled.select`
  display: flex;
  width: 100%;
  border: none;
  padding: 12px 16px;
  border-radius: 0.375rem;
  background: #f5f5f5;
  color: #787878;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  appearance: none;
`;

export const DropdownIcon = styled.img`
  position: absolute;
  top: 50%;
  right: 19px;
  transform: translateY(-50%);
  pointer-events: none;
`;

export const SelectionToggleWrapper = styled.div`
  display: flex;
  background-color: #f7f7f7;
  border-radius: 0.375rem;
  padding: 2px;
`;

export const SelectionToggleButton = styled.button<{ active: boolean }>`
  border: none;
  background-color: ${(props) => (props.active ? '#ddd' : 'transparent')};
  color: #787878;
  font-size: 0.875rem;
  border-radius: 0.375rem;
  padding: 10px;
  font-weight: 600;
  cursor: pointer;
  letter-spacing: -0.42px;
  white-space: nowrap;
`;

export const QuestionWrapper = styled.div`
  display: flex;
  gap: 36px;
`;

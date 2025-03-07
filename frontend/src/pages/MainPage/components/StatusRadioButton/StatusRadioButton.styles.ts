import styled from 'styled-components';

export const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

export const RadioInput = styled.input`
  display: none;
`;

export const CustomRadio = styled.span<{ isActive: boolean }>`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 1px solid ${({ isActive }) => (isActive ? '#00a6ff' : '#ccc')};
  background-color: #d9d9d9;
  position: relative;
  margin-right: 8px;

  ${({ isActive }) =>
    isActive &&
    `
    background-color: #fff;
    &::after {
      content: '';
      width: 14px;
      height: 14px;
      background-color: rgba(0, 166, 255, 0.5);
      border-radius: 50%;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  `}
`;

export const RadioText = styled.span<{ isActive: boolean }>`
  font-size: 0.75rem;
  color: ${({ isActive }) => (isActive ? '#818181' : '#aaa')};
  font-weight: 500;
  user-select: none;
`;

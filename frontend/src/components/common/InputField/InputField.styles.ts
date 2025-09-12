import styled from 'styled-components';

export const InputContainer = styled.div<{ width: string; readOnly?: boolean }>`
  width: ${(props) => props.width};
  max-width: 100%;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const Label = styled.label`
  font-size: 1.125rem;
  margin-bottom: 12px;
  font-weight: 600;
`;

export const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

export const Input = styled.input<{ hasError?: boolean; readOnly?: boolean; isSuccess?: boolean; }>`
  flex: 1;
  height: 45px;
  padding: 12px 18px;
  border: 1px solid
    ${({ hasError, isSuccess }) =>
    hasError ? 'red' : isSuccess ? '#28a745' : '#c5c5c5'};
  background-color: transparent;
  border-radius: 6px;
  outline: none;
  font-size: 1.125rem;
  letter-spacing: 0;
  color: rgba(0, 0, 0, 0.8);
  ${({ readOnly }) => readOnly && 'cursor: pointer;'}
  transition: background 0.2s;

  :hover {
    ${({ readOnly }) => readOnly && 'cursor: pointer;'}
  }

  :focus {
    outline: none;
    box-shadow: 0 0 3px;
    border-color: ${({ hasError, isSuccess, readOnly }) =>
      readOnly
        ? '#c5c5c5'
        : hasError
        ? 'red'
        : isSuccess
        ? '#28a745'
        : '#007bff'};
    ${({ readOnly }) => readOnly && 'cursor: pointer;'}
  }

  &:disabled {
    background-color: rgba(0, 0, 0, 0.05);
  }

  &::placeholder {
    color: rgba(0, 0, 0, 0.3);
    transition: color 0.25s ease;
  }
  
  &:focus::placeholder {
    color: transparent;
  }
`;

export const ClearButton = styled.button`
  position: absolute;
  right: 18px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 18px;
    height: 18px;
  }

  &:hover img {
    opacity: 0.7;
  }
`;

export const ToggleButton = styled.button`
  position: absolute;
  right: 40px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: gray;
`;

export const CharCount = styled.span`
  position: absolute;
  color: #c5c5c5;
  top: 110%;
  right: 0;
  font-size: 14px;
  letter-spacing: -0.96px;
`;

export const HelperText = styled.div`
  position: absolute;
  left: 0;
  top: 100%;
  font-size: 0.75rem;
  color: red;
  margin-top: 4px;
  pointer-events: none;
  white-space: nowrap;
  z-index: 1;
`;


import styled from 'styled-components';

//Todo : InputField 컴포넌트와 중복되는 부분이 많아 추후 리팩토링 검토

export const TextAreaContainer = styled.div<{ width: string }>`
  width: ${(props) => props.width};
  min-width: 300px;
  display: flex;
  flex-direction: column;
`;

export const Label = styled.label`
  font-size: 1.125rem;
  margin-bottom: 12px;
  font-weight: 600;
`;

export const TextAreaWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

export const TextArea = styled.textarea<{ hasError?: boolean }>`
  flex: 1;
  height: 45px;
  padding: 12px 18px;
  border: 1px solid ${({ hasError }) => (hasError ? 'red' : '#c5c5c5')};
  border-radius: 6px;
  outline: none;
  font-size: 1.125rem;
  letter-spacing: 0;
  color: rgba(0, 0, 0, 0.8);
  overflow: hidden;
  resize: none;

  &:focus {
    border-color: ${({ hasError }) => (hasError ? 'red' : '#007bff')};
    box-shadow: 0 0 3px
      ${({ hasError }) =>
    hasError ? 'rgba(255, 0, 0, 0.5)' : 'rgba(0, 123, 255, 0.5)'};
  }

  &:disabled {
    background-color: rgba(0, 0, 0, 0.05);
  }
  &::placeholder {
    color: rgba(0, 0, 0, 0.3);
  }
`;

export const CharCount = styled.span`
  position: absolute;
  color: #c5c5c5;
  right: 0;
  top: 100%;
  font-size: 16px;
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

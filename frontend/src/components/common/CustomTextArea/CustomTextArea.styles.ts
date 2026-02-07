import styled from 'styled-components';
import { colors } from '@/styles/theme/colors';

//Todo : InputField 컴포넌트와 중복되는 부분이 많아 추후 리팩토링 검토

export const TextAreaContainer = styled.div<{ width: string }>`
  width: ${(props) => props.width};
  max-width: 100%;
  display: flex;
  flex-direction: column;
`;

export const Label = styled.label`
  font-size: 1.125rem;
  margin-bottom: 8px;
  font-weight: 600;
`;

export const TextAreaWrapper = styled.div`
  position: relative;
  display: flex;
`;

export const TextArea = styled.textarea<{ hasError?: boolean }>`
  flex: 1;
  padding: 12px 36px 12px 18px;
  border: 1px solid
    ${({ hasError }) => (hasError ? 'red' : colors.gray[500])};
  border-radius: 6px;
  outline: none;
  font-size: 1.125rem;
  letter-spacing: 0;
  color: rgba(0, 0, 0, 0.8);
  overflow: hidden;
  resize: none;

  &:disabled {
    background-color: rgba(0, 0, 0, 0.05);
  }

  &::placeholder {
    color: ${colors.gray[600]};
    font-size: 16px;
    transition: color 0.25s ease;
  }
`;

export const ClearButton = styled.button`
  position: absolute;
  right: 18px;
  bottom: 12px;
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

export const CharCount = styled.span`
  position: absolute;
  color: ${colors.gray[500]};
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

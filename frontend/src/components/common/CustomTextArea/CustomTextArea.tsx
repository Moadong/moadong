import { useEffect, useRef } from 'react';
import clearIcon from '@/assets/images/icons/input_clear_button_icon.svg';
import * as Styled from './CustomTextArea.styles';

//Todo : InputField 컴포넌트와 중복되는 부분이 많아 추후 리팩토링 검토

interface CustomTextAreaProps {
  placeholder?: string;
  width?: string;
  maxLength?: number;
  label?: string;
  showMaxChar?: boolean;
  showClearButton?: boolean;
  disabled?: boolean;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onClear?: () => void;
  isError?: boolean;
  helperText?: string;
}

const CustomTextArea = ({
  placeholder = '입력하세요',
  width = '100%',
  maxLength,
  label,
  showMaxChar = false,
  showClearButton = false,
  disabled = false,
  value = '',
  onChange,
  onClear,
  isError,
  helperText,
}: CustomTextAreaProps) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (disabled) {
      return;
    }
    const el = textAreaRef.current;
    if (el) {
      el.style.height = 'auto'; // 초기화
      el.style.height = `${el.scrollHeight}px`;
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const inputValue = e.target.value;
    if (maxLength !== undefined && inputValue.length > maxLength) {
      return;
    }
    onChange?.(e);
  };

  const handleClear = () => {
    if (!disabled && onClear) {
      onClear();
    }
  };

  return (
    <Styled.TextAreaContainer width={width}>
      {label && <Styled.Label>{label}</Styled.Label>}
      <Styled.TextAreaWrapper>
        <Styled.TextArea
          ref={textAreaRef}
          onChange={handleChange}
          placeholder={placeholder}
          maxLength={maxLength}
          disabled={disabled}
          hasError={isError}
          value={value}
        />
        {showClearButton && !disabled && (
          <Styled.ClearButton type="button" onClick={handleClear}>
            <img src={clearIcon} alt="삭제" />
          </Styled.ClearButton>
        )}
      </Styled.TextAreaWrapper>
        {showMaxChar && maxLength !== undefined && (
          <Styled.CharCount>
            {value.length}/{maxLength}
          </Styled.CharCount>
        )}
      {isError && helperText && (
        <Styled.HelperText>{helperText}</Styled.HelperText>
      )}
    </Styled.TextAreaContainer>
  );
};

export default CustomTextArea;

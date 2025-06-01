import * as Styled from './CustomTextArea.styles';

interface CustomInputProps {
  placeholder?: string;
  width?: string;
  maxLength?: number;
  label?: string;
  showMaxChar?: boolean;
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
  disabled = false,
  value = '',
  onChange,
  isError,
  helperText,
}: CustomInputProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const inputValue = e.target.value;
    if (maxLength !== undefined && inputValue.length > maxLength) {
      return;
    }
    onChange?.(e);
  };

  return (
    <Styled.InputContainer width={width}>
      {label && <Styled.Label>{label}</Styled.Label>}
      <Styled.InputWrapper>
        <Styled.TextArea
          onChange={handleChange}
          placeholder={placeholder}
          maxLength={maxLength}
          disabled={disabled}
          hasError={isError}
          value={value}
        />
        {showMaxChar && maxLength !== undefined && (
          <Styled.CharCount>
            {value.length}/{maxLength}
          </Styled.CharCount>
        )}
      </Styled.InputWrapper>
      {isError && helperText && (
        <Styled.HelperText>{helperText}</Styled.HelperText>
      )}
    </Styled.InputContainer>
  );
};

export default CustomTextArea;

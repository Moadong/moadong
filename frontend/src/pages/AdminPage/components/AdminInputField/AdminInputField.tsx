import type { ChangeEvent } from 'react';
import { useState } from 'react';
import ClearButtonIcon from '@/assets/images/icons/dark_clear_button_icon.svg?react';
import * as Styled from './AdminInputField.styles';

interface AdminInputFieldProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onClear?: () => void;
  placeholder?: string;
  type?: 'text' | 'password';
  isError?: boolean;
  helperText?: string;
  maxLength?: number;
}

const AdminInputField = ({
  value,
  onChange,
  onClear,
  placeholder,
  type = 'text',
  isError,
  helperText,
  maxLength,
}: AdminInputFieldProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleClear = (e: React.MouseEvent) => {
    e.preventDefault();
    onClear?.();
  };

  const inputType =
    type === 'password' ? (isPasswordVisible ? 'text' : 'password') : type;

  return (
    <Styled.Wrapper>
      <Styled.Card $isError={isError}>
        <Styled.Input
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          type={inputType}
          maxLength={maxLength}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        {type === 'password' ? (
          <Styled.ToggleButton
            type='button'
            onClick={() => setIsPasswordVisible((v) => !v)}
          >
            {isPasswordVisible ? '숨기기' : '보기'}
          </Styled.ToggleButton>
        ) : (
          isFocused && value && onClear && (
            <Styled.ClearButton
              type='button'
              onMouseDown={handleClear}
              aria-label='지우기'
            >
              <ClearButtonIcon />
            </Styled.ClearButton>
          )
        )}
      </Styled.Card>
      {isError && helperText && (
        <Styled.HelperText>{helperText}</Styled.HelperText>
      )}
    </Styled.Wrapper>
  );
};

export default AdminInputField;
